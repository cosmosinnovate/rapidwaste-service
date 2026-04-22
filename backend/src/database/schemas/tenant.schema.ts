import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipCode?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };

  @Prop({ type: Object, default: {} })
  website: {
    title?: string;
    description?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    aboutText?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };

  @Prop({ type: Object, default: {} })
  pricing: {
    general: {
      basePrice: number;
      perSignature: number;
      urgentFee: number;
    };
    loan_signing: {
      basePrice: number;
      documentThreshold: number;
      additionalFee: number;
    };
    estate_planning: {
      basePrice: number;
      documentThreshold: number;
      additionalFee: number;
    };
  };

  @Prop({ type: Object, default: {} })
  settings: {
    allowUrgentBookings: boolean;
    maxDocumentsPerBooking: number;
    maxWitnesses: number;
    requireWitnesses: boolean;
    autoAssignNotaries: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };

  @Prop({ type: [String], default: [] })
  allowedServiceTypes: string[];

  @Prop({ type: [String], default: [] })
  notaryIds: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

// Indexes for performance
TenantSchema.index({ subdomain: 1 }, { unique: true });
TenantSchema.index({ isActive: 1 });
TenantSchema.index({ email: 1 });
TenantSchema.index({ createdAt: -1 });
