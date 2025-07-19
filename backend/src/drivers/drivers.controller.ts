import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DriversService } from './drivers.service';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get all drivers',
    description: 'Retrieves a list of all drivers in the system for admin management.',
  })
  @ApiResponse({
    status: 200,
    description: 'Drivers retrieved successfully',
    example: {
      success: true,
      data: [
        {
          driverId: 'D0001',
          firstName: 'John',
          lastName: 'Driver',
          email: 'john.driver@rapidwaste.com',
          status: 'available',
          vehicleInfo: {
            make: 'Ford',
            model: 'Transit',
            year: 2022,
            licensePlate: 'RW-001',
          },
        },
      ],
      count: 1,
    },
  })
  async getAllDrivers() {
    const drivers = await this.driversService.getAllDrivers();
    
    return {
      success: true,
      data: drivers,
      count: drivers.length,
    };
  }

  @Get(':driverId/dashboard')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  @ApiOperation({
    summary: 'Get driver dashboard data',
    description: 'Retrieves dashboard information for a specific driver including stats and recent bookings.',
  })
  @ApiParam({
    name: 'driverId',
    description: 'Unique driver ID',
    example: 'D0001',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver dashboard data retrieved successfully',
    example: {
      success: true,
      data: {
        driverId: 'D0001',
        name: 'John Driver',
        stats: {
          todayPickups: 5,
          todayEarnings: 275.50,
          thisWeekPickups: 28,
          thisWeekEarnings: 1850.00,
        },
        recentBookings: [
          {
            bookingId: 'EMG-A4X9K2',
            customerName: 'John Doe',
            serviceType: 'emergency',
            status: 'scheduled',
          },
        ],
      },
    },
  })
  async getDashboard(@Param('driverId') driverId: string) {
    const dashboard = await this.driversService.getDriverDashboard(driverId);
    
    return {
      success: true,
      data: dashboard,
    };
  }

  @Get(':driverId/bookings')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  @ApiOperation({
    summary: 'Get bookings assigned to driver',
    description: 'Retrieves all bookings assigned to a specific driver with optional filtering.',
  })
  @ApiParam({
    name: 'driverId',
    description: 'Unique driver ID',
    example: 'D0001',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by booking status',
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    example: 'scheduled',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by date (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver bookings retrieved successfully',
    example: {
      success: true,
      data: [
        {
          bookingId: 'EMG-A4X9K2',
          customerName: 'John Doe',
          address: '123 Main Street, Anytown',
          serviceType: 'emergency',
          status: 'scheduled',
          estimatedPrice: 50,
          scheduledTime: '2024-12-25T10:30:00Z',
        },
      ],
      count: 1,
    },
  })
  async getBookings(
    @Param('driverId') driverId: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const bookings = await this.driversService.getDriverBookings(driverId, status, date);
    
    return {
      success: true,
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('available')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get available drivers',
    description: 'Retrieves a list of all drivers who are currently available for pickup assignments.',
  })
  @ApiResponse({
    status: 200,
    description: 'Available drivers retrieved successfully',
    example: {
      success: true,
      data: [
        {
          driverId: 'D0001',
          name: 'John Driver',
          status: 'available',
          currentLocation: { lat: 40.7128, lng: -74.0060 },
          vehicleType: 'pickup_truck',
        },
      ],
      count: 1,
    },
  })
  async getAvailableDrivers() {
    const drivers = await this.driversService.getAvailableDrivers();
    
    return {
      success: true,
      data: drivers,
      count: drivers.length,
    };
  }

  @Patch(':driverId/status')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  @ApiOperation({
    summary: 'Update driver status',
    description: 'Updates the availability status of a driver (available, busy, offline).',
  })
  @ApiParam({
    name: 'driverId',
    description: 'Unique driver ID',
    example: 'D0001',
  })
  @ApiBody({
    description: 'Driver status update',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['available', 'busy', 'offline'],
          description: 'New driver status',
          example: 'available',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Driver status updated successfully',
    example: {
      success: true,
      message: 'Driver status updated successfully',
      data: {
        driverId: 'D0001',
        status: 'available',
      },
    },
  })
  async updateStatus(
    @Param('driverId') driverId: string,
    @Body('status') status: string,
  ) {
    const driver = await this.driversService.updateDriverStatus(driverId, status);
    
    return {
      success: true,
      message: 'Driver status updated successfully',
      data: driver,
    };
  }

  @Patch(':driverId/location')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  @ApiOperation({
    summary: 'Update driver location',
    description: 'Updates the current GPS location of a driver for tracking and assignment optimization.',
  })
  @ApiParam({
    name: 'driverId',
    description: 'Unique driver ID',
    example: 'D0001',
  })
  @ApiBody({
    description: 'GPS coordinates',
    schema: {
      type: 'object',
      properties: {
        lat: {
          type: 'number',
          description: 'Latitude coordinate',
          example: 40.7128,
        },
        lng: {
          type: 'number',
          description: 'Longitude coordinate',
          example: -74.0060,
        },
      },
      required: ['lat', 'lng'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Driver location updated successfully',
    example: {
      success: true,
      message: 'Driver location updated successfully',
      data: {
        driverId: 'D0001',
        location: { lat: 40.7128, lng: -74.0060 },
      },
    },
  })
  async updateLocation(
    @Param('driverId') driverId: string,
    @Body() location: { lat: number; lng: number },
  ) {
    const driver = await this.driversService.updateLocation(
      driverId,
      location.lat,
      location.lng,
    );
    
    return {
      success: true,
      message: 'Driver location updated successfully',
      data: driver,
    };
  }

  @Post()
  async createDriver(
    @Body() createDriverDto: {
      user: any;
      driver: any;
    },
  ) {
    const driver = await this.driversService.createDriver(
      createDriverDto.user,
      createDriverDto.driver,
    );
    
    return {
      success: true,
      message: 'Driver created successfully',
      data: driver,
    };
  }
} 