import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
    description: 'Admin notes about the booking',
    example: 'Booking updated by admin',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiPropertyOptional({
    description: 'Final price charged for the service',
    example: 65.50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'actualPrice must be a number' })
  @Transform(({ value }) => parseFloat(value))
  actualPrice?: number;
} 