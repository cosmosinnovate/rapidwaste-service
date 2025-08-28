import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: 'New booking status',
    enum: ['pending', 'scheduled', 'session-active', 'documents-ready', 'canceled'],
    example: 'session-active',
  })
  @IsEnum(['pending', 'scheduled', 'session-active', 'documents-ready', 'canceled'])
  status: string;

  @ApiPropertyOptional({
    description: 'Notes from the notary about the session',
    example: 'Client connection was unstable but we managed to complete the session.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

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