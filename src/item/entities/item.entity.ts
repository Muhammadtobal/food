import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  image: string;
  @Column()
  price: string;
  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.item, {
    onDelete: 'CASCADE',
  })
  cartItems: CartItem;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
