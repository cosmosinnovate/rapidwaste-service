import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeConfig {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-06-30.basil',
    });
  }

  getStripe(): Stripe {
    return this.stripe;
  }

  getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || '';
  }
} 