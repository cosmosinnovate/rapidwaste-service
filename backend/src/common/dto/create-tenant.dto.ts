import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BrandingDto {
  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Primary color hex code' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Secondary color hex code' })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional({ description: 'Font family' })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiPropertyOptional({ description: 'Custom CSS' })
  @IsOptional()
  @IsString()
  customCSS?: string;
}

class WebsiteDto {
  @ApiPropertyOptional({ description: 'Website title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Website description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Hero section title' })
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional({ description: 'Hero section subtitle' })
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional({ description: 'About section text' })
  @IsOptional()
  @IsString()
  aboutText?: string;

  @ApiPropertyOptional({ description: 'Contact information' })
  @IsOptional()
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

class PricingDto {
  @ApiPropertyOptional({ description: 'General notary pricing' })
  @IsOptional()
  general?: {
    basePrice: number;
    perSignature: number;
    urgentFee: number;
  };

  @ApiPropertyOptional({ description: 'Loan signing pricing' })
  @IsOptional()
  loan_signing?: {
    basePrice: number;
    documentThreshold: number;
    additionalFee: number;
  };

  @ApiPropertyOptional({ description: 'Estate planning pricing' })
  @IsOptional()
  estate_planning?: {
    basePrice: number;
    documentThreshold: number;
    additionalFee: number;
  };
}

class SettingsDto {
  @ApiPropertyOptional({ description: 'Allow urgent bookings' })
  @IsOptional()
  @IsBoolean()
  allowUrgentBookings?: boolean;

  @ApiPropertyOptional({ description: 'Maximum documents per booking' })
  @IsOptional()
  @IsNumber()
  maxDocumentsPerBooking?: number;

  @ApiPropertyOptional({ description: 'Maximum witnesses allowed' })
  @IsOptional()
  @IsNumber()
  maxWitnesses?: number;

  @ApiPropertyOptional({ description: 'Require witnesses' })
  @IsOptional()
  @IsBoolean()
  requireWitnesses?: boolean;

  @ApiPropertyOptional({ description: 'Auto assign notaries' })
  @IsOptional()
  @IsBoolean()
  autoAssignNotaries?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({ description: 'SMS notifications' })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;
}

export class CreateTenantDto {
  @ApiProperty({ description: 'Unique subdomain for the tenant', example: 'johnsmith' })
  @IsString()
  subdomain: string;

  @ApiProperty({ description: 'Tenant name', example: 'John Smith Notary Services' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Tenant description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Contact email', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Business address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Branding configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => BrandingDto)
  branding?: BrandingDto;

  @ApiPropertyOptional({ description: 'Website configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => WebsiteDto)
  website?: WebsiteDto;

  @ApiPropertyOptional({ description: 'Pricing configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @ApiPropertyOptional({ description: 'Tenant settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings?: SettingsDto;

  @ApiPropertyOptional({ description: 'Allowed service types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedServiceTypes?: string[];

  @ApiPropertyOptional({ description: 'Assigned notary IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notaryIds?: string[];
}

export class UpdateTenantDto extends CreateTenantDto {
  @ApiPropertyOptional({ description: 'Tenant active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
