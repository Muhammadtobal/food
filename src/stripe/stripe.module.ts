import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { DeliveryInformationModule } from 'src/delivery-information/delivery-information.module';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { OrderModule } from 'src/order/order.module';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Cart, DeliveryInformation, Order]),
    CartModule,
    CartItemModule,
    DeliveryInformationModule,
    OrderModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
