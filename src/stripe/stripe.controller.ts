// stripe/stripe.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/utils/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  async checkout(@Request() req) {
    console.log(req.user);
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id: req.user.userId,
        },
      },
    });

    const cartItems = await this.cartItemRepo.find({
      where: {
        cart: {
          id: cart?.id,
        },
      },
      relations: ['item'],
    });

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty. Cannot create Stripe Checkout Session.');
    }

    const session = await this.stripeService.createCheckoutSession(
      cartItems,
      req.user.email,
    );
    return { url: session.url };
  }
}
