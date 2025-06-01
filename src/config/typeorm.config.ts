import { config } from 'dotenv';
import { Category } from 'src/category/entities/category.entity';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { Item } from 'src/item/entities/item.entity';
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
  entities: [Item,Category,DeliveryInformation],
  migrations: [isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],

  synchronize: false,
  logging: false,
});

export default AppDataSource; 