import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsDateString, MinLength, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '(555) 123-4567',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Customer city',
    example: 'Downtown',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Customer zip code',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({
    description: 'Type of notary service requested',
    enum: ['general', 'loan_signing', 'estate_planning'],
    example: 'general',
  })
  @IsEnum(['general', 'loan_signing', 'estate_planning'])
  serviceType: string;

  @ApiPropertyOptional({
    description: 'Number of documents to be notarized',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  documentCount?: number;

  @ApiPropertyOptional({
    description: 'Number of witnesses required',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  witnesses?: number;

  @ApiPropertyOptional({
    description: 'Preferred appointment date',
    example: '2024-12-25',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiPropertyOptional({
    description: 'Preferred appointment time',
    example: '10:30 AM',
  })
  @IsOptional()
  @IsString()
  preferredTime?: string;

  @ApiPropertyOptional({
    description: 'Special instructions for the notary',
    example: 'This is for a real estate closing.',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({
    description: 'Whether this is an urgent appointment requiring priority',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  urgentAppointment?: boolean;

  @ApiProperty({
    description: 'The calculated price of the booking',
    example: 25,
  })
  @IsNumber()
  price: number;
}