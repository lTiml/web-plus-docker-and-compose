import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  MinLength,
  MaxLength,
  IsUrl,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { Offer } from 'src/offers/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @IsDecimal({ decimal_digits: '2' })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ length: 1024 })
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
