import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateCartDto {
  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: 'active' | 'completed' | 'cancelled';
    @IsOptional()
    @IsInt()
    userId: number;
} 