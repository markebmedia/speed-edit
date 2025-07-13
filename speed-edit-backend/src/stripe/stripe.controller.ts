// src/stripe/stripe.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckout(@Body() body: { imageUrl: string }) {
    const { imageUrl } = body;
    const sessionUrl = await this.stripeService.createCheckoutSession(imageUrl);
    return { url: sessionUrl };
  }
}



