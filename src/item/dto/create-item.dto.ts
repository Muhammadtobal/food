// src/item/dto/create-item.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number; 
}
