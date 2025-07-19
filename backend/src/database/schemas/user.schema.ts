import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['customer', 'driver', 'admin'], default: 'customer' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  zipCode?: string;

  // Driver-specific fields
  @Prop()
  driverId?: string;

  @Prop({ type: Object })
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };

  @Prop({ default: Date.now })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); 