import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const isCompiled = __dirname.includes('dist');
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [],
  migrations: [isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],

  synchronize: false,
  logging: false,
});
