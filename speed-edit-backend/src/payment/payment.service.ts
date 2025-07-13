// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2022-11-15',
    });
  }

  async createCheckoutSession(imageUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Speed Edit Download',
            },
            unit_amount: 199, // £1.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://speed-edit.onrender.com/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://speed-edit.onrender.com/payment/cancel`,
      metadata: { imageUrl },
    });

    return session.url;
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
}

