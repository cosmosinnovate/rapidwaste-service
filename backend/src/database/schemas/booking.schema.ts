import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  driverId?: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ 
    enum: ['regular', 'emergency', 'bulk'], 
    required: true 
  })
  serviceType: string;

  @Prop({ 
    enum: ['1-5', '6-10', '11+'], 
    required: true,
    default: '1-5'
  })
  bagCount: string;

  @Prop()
  preferredDate?: Date;

  @Prop()
  preferredTime?: string;

  @Prop()
  scheduledTime?: string;

  @Prop()
  specialInstructions?: string;

  @Prop({ default: false })
  urgentPickup: boolean;

  @Prop({ 
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  })
  priority: string;

  @Prop({ required: true })
  estimatedPrice: number;

  @Prop()
  actualPrice?: number;

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
  completedAt?: Date;

  @Prop()
  notes?: string;

  @Prop()
  driverNotes?: string;

  @Prop({ type: Object })
  location?: {
    lat: number;
    lng: number;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking); 