import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTenantDto {
  // Company Info
  @ApiProperty({ example: 'Washington DC Pro Movers' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'washingtondc' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'concierge@wdcpromovers.com' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ example: '(555) 123-4567' })
  @IsString()
  @IsOptional()
  phone?: string;

  // Admin User Info
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  adminFirstName: string;

  @ApiProperty({ example: 'Mover' })
  @IsString()
  @IsNotEmpty()
  adminLastName: string;

  @ApiProperty({ example: 'admin123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
