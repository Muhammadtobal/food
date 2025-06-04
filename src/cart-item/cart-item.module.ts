import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartModule } from 'src/cart/cart.module';
import { ItemModule } from 'src/item/item.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CartItem,Cart,Item,User]),CartModule,ItemModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
