import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'driver@rapidwaste.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '(555) 123-4567',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User role in the system',
    enum: ['customer', 'driver'],
    example: 'customer',
    default: 'customer',
  })
  @IsOptional()
  @IsEnum(['customer', 'driver'])
  role?: string;

  @ApiPropertyOptional({
    description: 'User street address',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'User city',
    example: 'Anytown',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'User ZIP/Postal code',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;
} 