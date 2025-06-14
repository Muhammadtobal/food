import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { OrderStatus } from 'src/utils/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Cart, (cart) => cart.order, {
    cascade: true,
  })
  @JoinColumn()
  cart: Cart;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.FOOD_PROCESSING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
