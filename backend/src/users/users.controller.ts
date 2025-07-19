import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserDocument } from '../database/schemas/user.schema';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('drivers')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get all drivers',
    description: 'Retrieves a list of all driver users in the system with optional filtering by active status.',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Filter by active status (true/false)',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Drivers retrieved successfully',
    example: {
      success: true,
      data: [
        {
          id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Driver',
          email: 'john.driver@rapidwaste.com',
          role: 'driver',
          driverId: 'D0001',
        },
      ],
      count: 1,
    },
  })
  async getDrivers(@Query('active') active?: string) {
    const isActive = active !== 'false';
    const drivers = await this.usersService.findDrivers(isActive);
    
    return {
      success: true,
      data: drivers,
      count: drivers.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier. Password is excluded from response.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    example: {
      success: true,
      data: {
        id: '507f1f77bcf86cd799439011',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'customer',
        phone: '(555) 123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        zipCode: '12345',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    example: {
      success: false,
      message: 'User not found',
    },
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    
    // Remove password from response
    const userObj = user.toObject();
    const { password, ...userWithoutPassword } = userObj;
    
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  @Patch(':id/role')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update user role',
    description: 'Updates a user\'s role. Only accessible by admin users.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    example: {
      success: true,
      data: {
        id: '507f1f77bcf86cd799439011',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'admin',
      },
    },
  })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: { role: string }
  ) {
    const user = await this.usersService.updateUserRole(id, updateRoleDto.role);
    
    return {
      success: true,
      data: user,
    };
  }
} 