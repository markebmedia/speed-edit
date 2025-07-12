// src/payment/payment.controller.ts
import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: any, @Res() res: Response) {
    const { imageUrl } = body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Missing imageUrl' });
    }

    try {
      const sessionUrl = await this.paymentService.createCheckoutSession(imageUrl);
      return res.json({ url: sessionUrl });
    } catch (error) {
      console.error('Stripe Error:', error);
      return res.status(500).json({ message: 'Failed to create checkout session' });
    }
  }

  @Get('success')
  async paymentSuccess(@Query('session_id') sessionId: string, @Res() res: Response) {
    if (!sessionId) {
      return res.send('Missing session ID');
    }

    try {
      const session = await this.paymentService.retrieveSession(sessionId);
      const imageUrl = session.metadata?.imageUrl;

      return res.send(`
        <html>
          <head><title>Payment Success</title></head>
          <body style="font-family: sans-serif; text-align: center; padding-top: 100px;">
            <h1>✅ Payment Successful!</h1>
            <p>Your image is ready to download:</p>
            <a href="${imageUrl}" download style="font-size: 18px;">⬇️ Download Image</a>
          </body>
        </html>
      `);
    } catch (err) {
      console.error(err);
      return res.send('Error retrieving payment details.');
    }
  }

  @Get('cancel')
  paymentCancel(@Res() res: Response) {
    return res.send(`
      <html>
        <head><title>Payment Cancelled</title></head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 100px;">
          <h1>❌ Payment Cancelled</h1>
          <p>No worries. You can try again anytime.</p>
          <a href="/">Return to Home</a>
        </body>
      </html>
    `);
  }
}



