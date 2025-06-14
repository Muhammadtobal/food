import { config } from 'dotenv';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Category } from 'src/category/entities/category.entity';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { Item } from 'src/item/entities/item.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
config();

const isCompiled = __dirname.includes('dist');
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Item, Category, DeliveryInformation, Cart, CartItem, User, Order],
  migrations: [isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],

  synchronize: false,
  logging: false,
});

export default AppDataSource;
