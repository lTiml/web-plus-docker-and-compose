import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOfferDto';
import { IUserRequest } from 'src/users/users.controller';
import { Offer } from './offer.entity';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() { user }: IUserRequest,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOfferById(id);
  }
}
