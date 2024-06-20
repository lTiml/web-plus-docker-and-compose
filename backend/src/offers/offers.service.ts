import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/createOfferDto';
import { UpdateWishDto } from 'src/wishes/dto/updateWishDto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const user = await this.usersService.findUserById(userId);
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете скидывать деньги на свой подарок',
      );
    }

    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new ForbiddenException(
        'Вы не можете предложить сумму больше стоимости подарка',
      );
    }

    await this.wishesService.update(createOfferDto.itemId, {
      raised: Number(wish.raised) + Number(createOfferDto.amount),
    } as UpdateWishDto);
    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findOfferById(id: number) {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(`Предложение с таким id ${id} не найдено.`);
    }
    return offer;
  }

  async find(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });
    offers.forEach((offer) => {
      if (offer.user) {
        delete offer.user.password;
      }
    });
    return offers;
  }
}
