import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/createWishlistDto';
import { UpdateWishlistDto } from './dto/updateWishlistDto';
import { WishList } from './wishlist.entity';
import { IUserRequest } from 'src/users/users.controller';

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.find();
  }

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user }: IUserRequest,
  ): Promise<WishList> {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<WishList> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: IUserRequest,
  ): Promise<WishList> {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  @Delete(':id')
  deleteOne(
    @Param('id') id: number,
    @Req() { user }: IUserRequest,
  ): Promise<WishList> {
    return this.wishlistsService.deleteOne(id, user.id);
  }
}
