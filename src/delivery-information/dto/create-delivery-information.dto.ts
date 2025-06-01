import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber, IsPostalCode } from 'class-validator';

export class CreateDeliveryInformationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsPhoneNumber() 
  phone: string;

  @IsNotEmpty()
  @IsPostalCode('any')
  zipCode: string;
}
