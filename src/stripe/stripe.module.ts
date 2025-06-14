import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem,Cart]),CartModule,CartItemModule
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
