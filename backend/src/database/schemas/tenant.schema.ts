import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string; // Used for subdomains or URL paths (e.g., 'washingtondc')

  @Prop({ unique: true, sparse: true })
  customDomain?: string; // Optional custom domain (e.g., 'moves.wdcpromovers.com')

  @Prop()
  logo?: string;

  @Prop({ type: Object })
  branding?: {
    primaryColor: string;
    secondaryColor: string;
  };

  @Prop({ required: true })
  contactEmail: string;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  stripeAccountId?: string;

  @Prop({ type: Object })
  settings?: {
    allowInstantBooking: boolean;
    requireDeposit: boolean;
    basePriceRegular: number;
    basePriceEmergency: number;
    basePriceBulk: number;
  };

  @Prop({ type: Object })
  content?: {
    heroTitle?: string;
    heroSubtitle?: string;
    servicesTitle?: string;
    servicesSubtitle?: string;
    aboutUs?: string;
  };
}

export const TenantSchema = SchemaFactory.createForClass(Tenant); 
