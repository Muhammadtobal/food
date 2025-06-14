// stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCheckoutSession(cartItems: any[], customerEmail: string) {
    const line_items = [
      ...cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item.name,
          },
          unit_amount: parseInt(item.item.price) * 100,
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Service Fee',
          },
          unit_amount: 500, // 5 dollars
        },
        quantity: 1,
      },
    ];

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    return session;
  }
}
