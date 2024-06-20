import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Wish } from './wishes/wish.entity';
import { WishList } from './wishlist/wishlist.entity';
import { Offer } from './offers/offer.entity';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlist/wishlists.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      schema: 'kupipodariday',
      entities: [User, Wish, WishList, Offer],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
