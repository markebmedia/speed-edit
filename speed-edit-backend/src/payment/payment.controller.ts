import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout')
  async createCheckout(
    @Body('imageUrl') imageUrl: string,
    @Res() res: Response,
  ) {
    if (!imageUrl) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Missing imageUrl' });
    }

    try {
      const sessionUrl = await this.paymentService.createCheckoutSession(imageUrl);
      return res.status(HttpStatus.OK).json({ url: sessionUrl });
    } catch (error) {
      console.error('Stripe Error:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to create checkout session' });
    }
  }

  @Get('success')
  async paymentSuccess(
    @Query('session_id') sessionId: string,
    @Res() res: Response,
  ) {
    if (!sessionId) {
      return res.status(HttpStatus.BAD_REQUEST).send('Missing session ID');
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
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error retrieving payment details.');
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



