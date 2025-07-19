import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DriverDocument = Driver & Document;

@Schema({ timestamps: true })
export class Driver {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  driverId: string;

  @Prop({ enum: ['available', 'busy', 'offline'], default: 'offline' })
  status: string;

  @Prop({ type: Object })
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };

  @Prop({ default: [] })
  todaysBookings: Types.ObjectId[];

  @Prop({ default: 0 })
  todaysEarnings: number;

  @Prop({ default: 0 })
  totalPickups: number;

  @Prop({ default: 0 })
  totalEarnings: number;

  @Prop({ default: 4.5 })
  rating: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({ type: Object })
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    capacity: string;
  };

  @Prop({ type: Object })
  workingHours?: {
    start: string;
    end: string;
  };

  @Prop({ default: [] })
  workingDays: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastActiveAt?: Date;

  @Prop({ type: Object })
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export const DriverSchema = SchemaFactory.createForClass(Driver); 