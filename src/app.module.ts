import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryInformationModule } from './delivery-information/delivery-information.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';



import AppDataSource from './config/typeorm.config';

@Module({
  imports: [
 
     ConfigModule.forRoot({isGlobal:true}),
     TypeOrmModule.forRoot(AppDataSource.options),
    ItemModule, OrderModule, CategoryModule, DeliveryInformationModule, CartModule, CartItemModule, AuthModule, UserModule],

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ItemModule,
    OrderModule,
    CategoryModule,
    DeliveryInformationModule,
    CartModule,
    CartItemModule,
    AuthModule,
    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
