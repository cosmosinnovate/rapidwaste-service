import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsDateString, MinLength } from 'class-validator';
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

  @ApiProperty({
    description: 'Pickup street address',
    example: '123 Main Street',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'City for pickup location',
    example: 'Anytown',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'ZIP/Postal code for pickup location',
    example: '12345',
  })
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: 'Type of waste pickup service',
    enum: ['regular', 'emergency', 'bulk'],
    example: 'emergency',
  })
  @IsEnum(['regular', 'emergency', 'bulk'])
  serviceType: string;

  @ApiProperty({
    description: 'Number of trash bags or bulk items',
    enum: ['1-5', '6-10', '11+'],
    example: '1-5',
  })
  @IsEnum(['1-5', '6-10', '11+'])
  bagCount: string;

  @ApiPropertyOptional({
    description: 'Preferred pickup date',
    example: '2024-12-25',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiPropertyOptional({
    description: 'Preferred pickup time',
    example: '10:30 AM',
  })
  @IsOptional()
  @IsString()
  preferredTime?: string;

  @ApiPropertyOptional({
    description: 'Special instructions for the driver',
    example: 'Behind the garage, use side gate',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({
    description: 'Whether this is an urgent pickup requiring priority',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  urgentPickup?: boolean;
} 