// src/order/dto/create-order.dto.ts

import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/utils/types';
import { CreateDeliveryInformationDto } from 'src/delivery-information/dto/create-delivery-information.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  deliveryId: number;
  @IsOptional()
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
