import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DeliveryInformationService } from 'src/delivery-information/delivery-information.service';
import { CreateDeliveryInformationDto } from 'src/delivery-information/dto/create-delivery-information.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly deliveryInformationService: DeliveryInformationService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Body() createDeliveryInformationDto: CreateDeliveryInformationDto,
  ) {
    const result = await this.authService.register(createUserDto);

    await this.deliveryInformationService.create(
      createDeliveryInformationDto,
      result.id,
    );

    return {
      success: true,
      message: 'User register successfully',
      data: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    return {
      success: true,
      message: 'success',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      success: true,
      message: 'User profile fetched successfully',
      data: req.user,
    };
  }
}
