// src/payment/payment.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: any, @Res() res: Response) {
    const { imageUrl } = body;
    if (!imageUrl) return res.status(400).json({ message: 'Missing imageUrl' });

    try {
      const sessionUrl = await this.stripeService.createCheckoutSession(imageUrl);
      return res.json({ url: sessionUrl });
    } catch (error) {
      console.error('Stripe Error:', error);
      return res.status(500).json({ message: 'Failed to create checkout session' });
    }
  }
}
