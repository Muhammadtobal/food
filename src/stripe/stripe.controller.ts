// stripe/stripe.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/utils/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateDeliveryInformationDto } from 'src/delivery-information/dto/create-delivery-information.dto';
import { DeliveryInformationService } from 'src/delivery-information/delivery-information.service';
import { UpdateCartDto } from 'src/cart/dto/update-cart.dto';
import { UpdateDeliveryInformationDto } from 'src/delivery-information/dto/update-delivery-information.dto';
import { DeliveryInformation } from 'src/delivery-information/entities/delivery-information.entity';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
class CheckoutDto {
  updateDeliveryInformationDto: UpdateDeliveryInformationDto;
  createOrderDto: CreateOrderDto;
}
@Controller('stripe')
export class StripeController {
  constructor(
    @InjectRepository(DeliveryInformation)
    private readonly deliveryRepo: Repository<DeliveryInformation>,
    private readonly stripeService: StripeService,
    private readonly deliveryInformationService: DeliveryInformationService,
    private readonly orderService: OrderService,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async checkout(
    @Request() req,
    @Body() createDeliveryInformationDto: CreateDeliveryInformationDto,
  ) {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: req.user.userId,
        },
      },
    });
    const delivery = await this.deliveryInformationService.create(
      createDeliveryInformationDto,
    );

    await this.orderService.create(req.user.userId, delivery);

    const cartItem = await this.cartItemRepo.find({
      where: {
        cart: {
          id: cart?.id,
        },
      },
      relations: ['item'],
    });
    const cartItems = cartItem.filter((i) => {
      if (i.deleted === false) return i;
    });
    await Promise.all(
      cartItems.map(async (i) => {
        i.deleted = true;
        await this.cartItemRepo.save(i);
      }),
    );

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException(
        'Cart is empty. Cannot create Stripe Checkout Session.',
      );
    }

    const session = await this.stripeService.createCheckoutSession(
      cartItems,
      req.user.email,
    );
    return { url: session.url };
  }
}
