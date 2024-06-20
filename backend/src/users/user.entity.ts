import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  MinLength,
  IsEmail,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';
import { Offer } from 'src/offers/offer.entity';
import { WishList } from 'src/wishlist/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  username: string;

  @Column({ length: 200, default: 'Пока ничего нет' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  about: string;

  @Column({ default: 'http://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => WishList, (wishlist) => wishlist.owner)
  wishlists: WishList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
