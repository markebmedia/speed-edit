// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // Force override type restriction if necessary
      apiVersion: '2024-04-10' as unknown as Stripe.LatestApiVersion,
    });
  }

  async createCheckoutSession(imageUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Enhanced Property Photo',
              images: [imageUrl],
            },
            unit_amount: 199, // £1.99
          },
          quantity: 1,
        },
      ],
      success_url: `https://www.markebmedia.com/speed-edit-upload?success=true`,
      cancel_url: `https://www.markebmedia.com/speed-edit-upload?cancelled=true`,
    });

    return session.url;
  }
}

