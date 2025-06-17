import { Cart } from 'src/cart/entities/cart.entity';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { UserRole } from 'src/utils/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
