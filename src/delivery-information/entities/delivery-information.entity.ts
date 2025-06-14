import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
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
export class DeliveryInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;
  @Column({ nullable: false })
  lastName: string;
  @Column({ nullable: false })
  emailD: string;
  @Column({ nullable: false })
  street: string;
  @Column({ nullable: false })
  city: string;
  @Column({ nullable: false })
  state: string;
  @Column({ nullable: false })
  country: string;
  @Column({ nullable: false })
  phone: string;
  @Column({ nullable: false })
  zipCode: string;
  @OneToOne(() => User, (user) => user.delivery, {
    cascade: true,
  })
  @JoinColumn()
  user: User;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
