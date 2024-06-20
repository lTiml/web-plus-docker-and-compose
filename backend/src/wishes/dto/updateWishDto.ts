import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './createWishDto';

export class UpdateWishDto extends PartialType(CreateWishDto) {}
