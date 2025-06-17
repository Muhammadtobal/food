import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Order } from './entities/order.entity';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { DeliveryInformationModule } from 'src/delivery-information/delivery-information.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Order, DeliveryInformation]),
    DeliveryInformationModule,
  ],
  controllers: [OrderController],
  exports: [OrderService],
  providers: [OrderService],
})
export class OrderModule {}
