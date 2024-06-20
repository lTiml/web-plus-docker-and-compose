import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishList } from './wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/createWishlistDto';
import { UpdateWishlistDto } from './dto/updateWishlistDto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistRepository: Repository<WishList>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  find(): Promise<WishList[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<WishList> {
    const user = await this.usersService.findUserById(userId);
    const wishes = await this.wishesService.find(createWishlistDto.itemsId);

    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findOne(id: number): Promise<WishList> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Список желаемого не найден');
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете менять чужой список желаемого',
      );
    }
    if (updateWishlistDto.itemsId) {
      const wishes = await this.wishesService.find(updateWishlistDto.itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(id, updateWishlistDto);
    } else {
      await this.wishlistRepository.update(id, updateWishlistDto);
    }
    return wishlist;
  }

  async deleteOne(wishId: number, userId: number) {
    const wishlist = await this.findOne(wishId);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете удалить чужой список желаемого',
      );
    }
    await this.wishlistRepository.delete(wishId);
    return wishlist;
  }
}
