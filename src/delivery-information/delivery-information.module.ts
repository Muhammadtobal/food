import { Module } from '@nestjs/common';
import { DeliveryInformationService } from './delivery-information.service';
import { DeliveryInformationController } from './delivery-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryInformation } from './entities/delivery-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryInformation])],
  controllers: [DeliveryInformationController],
  exports: [DeliveryInformationService],
  providers: [DeliveryInformationService],
})
export class DeliveryInformationModule {}
