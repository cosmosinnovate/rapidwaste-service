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
import { TenantId } from '../auth/decorators/tenant-id.decorator';
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
  async getAllDrivers(@TenantId() tenantId: string) {
    const drivers = await this.driversService.getAllDrivers(tenantId);
    
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
  async getDashboard(
    @TenantId() tenantId: string,
    @Param('driverId') driverId: string
  ) {
    const dashboard = await this.driversService.getDriverDashboard(tenantId, driverId);
    
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
  async getBookings(
    @TenantId() tenantId: string,
    @Param('driverId') driverId: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const bookings = await this.driversService.getDriverBookings(tenantId, driverId, status, date);
    
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
  async getAvailableDrivers(@TenantId() tenantId: string) {
    const drivers = await this.driversService.getAvailableDrivers(tenantId);
    
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
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('driverId') driverId: string,
    @Body('status') status: string,
  ) {
    const driver = await this.driversService.updateDriverStatus(tenantId, driverId, status);
    
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
  async updateLocation(
    @TenantId() tenantId: string,
    @Param('driverId') driverId: string,
    @Body() location: { lat: number; lng: number },
  ) {
    const driver = await this.driversService.updateLocation(
      tenantId,
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
    @TenantId() tenantId: string,
    @Body() createDriverDto: {
      user: any;
      driver: any;
    },
  ) {
    const driver = await this.driversService.createDriver(
      tenantId,
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
