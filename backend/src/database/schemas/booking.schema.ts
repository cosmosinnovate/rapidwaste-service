import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  preferredDate?: Date;

  @Prop()
  preferredTime?: string;

  @Prop()
  scheduledTime?: string;

  @Prop()
  specialInstructions?: string;

  @Prop({ 
    enum: ['general', 'loan_signing', 'estate_planning'], 
    required: true 
  })
  serviceType: string;

  @Prop()
  documentCount?: number;

  @Prop()
  witnesses?: number;

  @Prop({ 
    enum: ['pending', 'scheduled', 'session-active', 'documents-ready', 'canceled'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  })
  priority: string;

  @Prop({ required: true })
  price: number;

  @Prop({ 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  })
  paymentStatus: string;

  @Prop()
  paymentMethod?: string;

  @Prop()
  stripePaymentIntentId?: string;

  @Prop()
  stripeCustomerId?: string;

  @Prop()
  providerSessionId?: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking); 