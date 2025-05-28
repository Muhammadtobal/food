import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import  AppDataSource from './config/typeorm.config';

@Module({
  imports: [
     ConfigModule.forRoot({isGlobal:true}),
     TypeOrmModule.forRoot(AppDataSource.options),
    ItemModule, OrderModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
