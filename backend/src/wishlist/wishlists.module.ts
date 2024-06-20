import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlist.controller';
import { WishlistsService } from './wishlists.service';
import { WishList } from './wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WishList]), WishesModule, UsersModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
