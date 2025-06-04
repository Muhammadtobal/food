import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsOptional()
  @IsInt()
  cartId: number;
  @IsOptional()
  @IsInt()
  itemId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity: number;
  @IsOptional()
  @IsInt()
  @IsPositive()
  total: number;
}
