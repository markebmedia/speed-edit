import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, // Fix for type conflict
  });

  async createCheckoutSession(imageUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'AI Photo Enhancement',
              images: [imageUrl], // Optional preview
            },
            unit_amount: 199, // £1.99 in pence
          },
          quantity: 1,
        },
      ],
      success_url: `https://speed-edit.com/success?img=${encodeURIComponent(imageUrl)}`,
      cancel_url: `https://speed-edit.com/cancel`,
    });

    return session.url;
  }
}
