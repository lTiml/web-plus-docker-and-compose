import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, MinLength, MaxLength, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column({ length: 1500 })
  @MaxLength(1500)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
