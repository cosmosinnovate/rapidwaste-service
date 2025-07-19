import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: 'New booking status',
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    example: 'in-progress',
  })
  @IsEnum(['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'])
  status: string;

  @ApiPropertyOptional({
    description: 'Notes from the driver about the pickup',
    example: 'Customer was not home, left bags at side door as instructed',
  })
  @IsOptional()
  @IsString()
  driverNotes?: string;

  @ApiPropertyOptional({
    description: 'Final price charged for the service',
    example: 65.50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  actualPrice?: number;

  @ApiPropertyOptional({
    description: 'Method of payment used',
    example: 'credit_card',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Status of payment',
    example: 'paid',
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;
} 