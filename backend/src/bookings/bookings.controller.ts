import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from '../common/dto/create-booking.dto';
import { UpdateBookingStatusDto } from '../common/dto/update-booking-status.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new waste pickup booking',
    description: 'Creates a new booking for waste pickup service. Automatically calculates pricing and generates booking ID.',
  })
  @ApiBody({ type: CreateBookingDto })
  async create(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.createBooking(createBookingDto);
    return {
      success: true,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Retrieves all bookings with optional filtering by status, service type, date, or driver.',
  })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('serviceType') serviceType?: string,
    @Query('date') date?: string,
    @Query('driverId') driverId?: string,
  ) {
    const filters = {
      ...(status && { status }),
      ...(serviceType && { serviceType }),
      ...(date && { date }),
      ...(driverId && { driverId }),
    };

    const bookings = await this.bookingsService.findAll(tenantId, filters);
    
    return {
      success: true,
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('stats')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'driver')
  async getStats(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    const stats = await this.bookingsService.getStats(tenantId, start, end);
    
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string
  ) {
    const booking = await this.bookingsService.findById(tenantId, id);
    
    return {
      success: true,
      data: booking,
    };
  }

  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    const booking = await this.bookingsService.updateStatus(tenantId, id, updateStatusDto);
    
    return {
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    };
  }

  @Patch(':id/assign-driver')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'driver')
  async assignDriver(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    const booking = await this.bookingsService.assignDriver(tenantId, id, driverId);
    
    return {
      success: true,
      message: 'Driver assigned successfully',
      data: booking,
    };
  }
}
