import { IsNotEmpty, IsString ,IsOptional} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsOptional()
  @IsString()
  image?: string | null;
}
