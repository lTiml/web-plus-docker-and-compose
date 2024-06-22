import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWishDto';
import { UpdateWishDto } from './dto/updateWishDto';
import { IUserRequest } from 'src/users/users.controller';
import { Wish } from './wish.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user }: IUserRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    const wish = await this.wishService.create(user.id, createWishDto);
    return wish;
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishService.findLast(5)[0];
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishService.findTop(5);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Request() { user }: IUserRequest) {
    return this.wishService.copy(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request(){ user }:IUserRequest, @Param('id') id: number, @Body() updateWishDto: UpdateWishDto): Promise<Wish> {
    return this.wishService.update(id, updateWishDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() { user }: IUserRequest) {
    return this.wishService.deleteOne(id, user.id);
  }
}
