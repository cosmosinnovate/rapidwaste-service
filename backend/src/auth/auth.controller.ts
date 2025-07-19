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
    summary: 'User login',
    description: 'Authenticates a user (customer or driver) and returns a JWT token for API access.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      driverLogin: {
        summary: 'Driver Login',
        description: 'Example login for a driver',
        value: {
          email: 'driver@rapidwaste.com',
          password: 'password123',
        },
      },
      customerLogin: {
        summary: 'Customer Login',
        description: 'Example login for a customer',
        value: {
          email: 'customer@example.com',
          password: 'mypassword',
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
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'driver@rapidwaste.com',
          firstName: 'John',
          lastName: 'Driver',
          role: 'driver',
          driverId: 'D0001',
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
    summary: 'User registration',
    description: 'Creates a new user account (customer or driver) and returns a JWT token.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
    examples: {
      customerRegistration: {
        summary: 'Customer Registration',
        description: 'Example registration for a new customer',
        value: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '(555) 987-6543',
          password: 'securePassword123',
          role: 'customer',
          address: '456 Oak Avenue',
          city: 'Otherville',
          zipCode: '67890',
        },
      },
      driverRegistration: {
        summary: 'Driver Registration',
        description: 'Example registration for a new driver',
        value: {
          firstName: 'Mike',
          lastName: 'Smith',
          email: 'mike.smith@rapidwaste.com',
          phone: '(555) 456-7890',
          password: 'driverPass456',
          role: 'driver',
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
} 