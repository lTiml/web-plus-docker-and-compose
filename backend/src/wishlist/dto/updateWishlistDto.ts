import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  @MaxLength(1500)
  @IsString()
  description: string;
}
