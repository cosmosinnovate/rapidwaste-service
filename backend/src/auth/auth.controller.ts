import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a user (customer or notary) and returns JWT tokens for API access.',
  })
  @ApiBody({
    description: 'User login credentials',
    examples: {
      customerLogin: {
        summary: 'Customer Login',
        description: 'Example login for a customer',
        value: {
          email: 'customer@example.com',
          password: 'customerPass123',
        },
      },
      notaryLogin: {
        summary: 'Notary Login',
        description: 'Example login for a notary',
        value: {
          email: 'notary@notarynow.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    example: {
      success: true,
      message: 'Login successful',
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'notary@notarynow.com',
          firstName: 'John',
          lastName: 'Notary',
          role: 'notary',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    example: {
      success: false,
      message: 'Invalid credentials',
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login successful',
      data: result,
    };
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'User Registration',
    description: 'Creates a new user account (customer or notary) and returns JWT tokens.',
  })
  @ApiBody({
    description: 'User registration data',
    examples: {
      customerRegistration: {
        summary: 'Customer Registration',
        description: 'Example registration for a new customer',
        value: {
          firstName: 'John',
          lastName: 'Customer',
          email: 'john.customer@example.com',
          phone: '(555) 123-4567',
          password: 'customerPass123',
          role: 'customer',
        },
      },
      notaryRegistration: {
        summary: 'Notary Registration',
        description: 'Example registration for a new notary',
        value: {
          firstName: 'Sarah',
          lastName: 'Notary',
          email: 'sarah.notary@notarynow.com',
          phone: '(555) 987-6543',
          password: 'notaryPass456',
          role: 'notary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    example: {
      success: true,
      message: 'Registration successful',
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'jane.doe@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'customer',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Registration failed - validation errors',
    example: {
      success: false,
      message: 'Validation failed',
      errors: ['email must be a valid email address'],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email already exists',
    example: {
      success: false,
      message: 'Email already exists',
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Registration successful',
      data: result,
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Uses a refresh token to get a new access token without requiring login.',
  })
  @ApiBody({
    description: 'Refresh token',
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: 'Valid refresh token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    example: {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'notary@notarynow.com',
          firstName: 'Sarah',
          lastName: 'Notary',
          role: 'notary',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
    example: {
      success: false,
      message: 'Invalid refresh token',
    },
  })
  async refresh(@Body() body: { refresh_token: string }) {
    const result = await this.authService.refreshToken(body.refresh_token);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    };
  }
}
 