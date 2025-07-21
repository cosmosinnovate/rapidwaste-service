import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { StripeConfig } from '../config/stripe.config';
import { Booking, BookingDocument } from '../database/schemas/booking.schema';
import { User, UserDocument } from '../database/schemas/user.schema';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private stripeConfig: StripeConfig,
  ) {
    this.stripe = this.stripeConfig.getStripe();
  }

  async createPaymentIntent(bookingId: string, customerId?: string) {
    // Find the booking
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create or get Stripe customer
    let stripeCustomerId = booking.stripeCustomerId;
    if (!stripeCustomerId) {
      // Use booking customer info if no user ID provided
      const customerEmail = booking.email;
      const customerName = booking.customerName;
      
      const stripeCustomer = await this.stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: {
          bookingId: booking.bookingId,
          bookingId_mongo: bookingId,
        },
      });
      stripeCustomerId = stripeCustomer.id;
    }

    // Create payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(booking.estimatedPrice * 100), // Convert to cents
      currency: 'usd',
      customer: stripeCustomerId,
      metadata: {
        bookingId: booking.bookingId,
        bookingId_mongo: bookingId,
        serviceType: booking.serviceType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update booking with payment intent ID and customer ID
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Find booking by payment intent ID
        const booking = await this.bookingModel.findOne({
          stripePaymentIntentId: paymentIntentId,
        });

        if (booking) {
          // Update booking payment status
          await this.bookingModel.findByIdAndUpdate(booking._id, {
            paymentStatus: 'paid',
            actualPrice: paymentIntent.amount / 100, // Convert from cents
          });

          return {
            success: true,
            message: 'Payment confirmed successfully',
            bookingId: booking.bookingId,
          };
        }
      }

      return {
        success: false,
        message: 'Payment not confirmed',
      };
    } catch (error) {
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async refundPayment(bookingId: string, amount?: number) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!booking.stripePaymentIntentId) {
      throw new BadRequestException('No payment found for this booking');
    }

    const refundAmount = amount ? Math.round(amount * 100) : undefined;

    const refund = await this.stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId,
      amount: refundAmount,
    });

    // Update booking payment status
    await this.bookingModel.findByIdAndUpdate(bookingId, {
      paymentStatus: 'refunded',
    });

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
    };
  }

  async getPaymentStatus(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!booking.stripePaymentIntentId) {
      return {
        paymentStatus: 'pending',
        message: 'No payment intent found',
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      booking.stripePaymentIntentId,
    );

    return {
      paymentStatus: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
    };
  }

  async createCustomerPortalSession(customerId: string) {
    const customer = await this.userModel.findById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Find customer's Stripe customer ID
    const booking = await this.bookingModel.findOne({
      customerId: customerId,
      stripeCustomerId: { $exists: true },
    });

    if (!booking?.stripeCustomerId) {
      throw new BadRequestException('No Stripe customer found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: booking.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    return {
      url: session.url,
    };
  }
} 