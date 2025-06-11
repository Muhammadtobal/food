import { Cart } from 'src/cart/entities/cart.entity';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' }) 
  cart: Cart;
  @ManyToOne(() => Item, (item) => item.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;
  @Column()
  quantity: number;
  @Column()
  subtotal: number;
  @Column()
  total: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
