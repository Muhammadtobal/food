import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/utils/types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
