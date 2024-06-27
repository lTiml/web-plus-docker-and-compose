import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  description: string = '';

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
