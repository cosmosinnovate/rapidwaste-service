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
  @ApiBody({
    type: CreateBookingDto,
    description: 'Booking details including customer information and service requirements',
    examples: {
      emergencyPickup: {
        summary: 'Emergency Same-Day Pickup',
        description: 'Example of an emergency pickup booking',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          address: '123 Main Street',
          city: 'Anytown',
          zipCode: '12345',
          serviceType: 'emergency',
          bagCount: '1-5',
          specialInstructions: 'Behind the garage, use side gate',
          urgentPickup: false,
        },
      },
      bulkRemoval: {
        summary: 'Bulk Item Removal',
        description: 'Example of bulk item removal booking',
        value: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          address: '456 Oak Avenue',
          city: 'Otherville',
          zipCode: '67890',
          serviceType: 'bulk',
          bagCount: '11+',
          specialInstructions: 'Old couch and dining table, call upon arrival',
          urgentPickup: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    example: {
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: 'EMG-A4X9K2',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        serviceType: 'emergency',
        estimatedPrice: 50,
        status: 'scheduled',
        priority: 'high',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking data provided',
    example: {
      success: false,
      message: 'Validation failed',
      errors: ['firstName must be at least 2 characters long'],
    },
  })
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
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by booking status',
    enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
    example: 'scheduled',
  })
  @ApiQuery({
    name: 'serviceType',
    required: false,
    description: 'Filter by service type',
    enum: ['regular', 'emergency', 'bulk'],
    example: 'emergency',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by booking date (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @ApiQuery({
    name: 'driverId',
    required: false,
    description: 'Filter by assigned driver ID',
    example: 'D0001',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bookings retrieved successfully',
    example: {
      success: true,
      data: [
        {
          bookingId: 'EMG-A4X9K2',
          customerName: 'John Doe',
          serviceType: 'emergency',
          status: 'scheduled',
          estimatedPrice: 50,
        },
      ],
      count: 1,
    },
  })
  async findAll(
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

    const bookings = await this.bookingsService.findAll(filters);
    
    return {
      success: true,
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('stats')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'driver')
  @ApiOperation({
    summary: 'Get booking statistics',
    description: 'Retrieves aggregate statistics about bookings for analytics dashboard.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for statistics period (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for statistics period (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics retrieved successfully',
    example: {
      success: true,
      data: {
        totalBookings: 150,
        totalRevenue: 7500.50,
        completedBookings: 120,
        pendingBookings: 20,
        emergencyBookings: 45,
      },
    },
  })
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    const stats = await this.bookingsService.getStats(start, end);
    
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Retrieves a specific booking by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the booking',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    example: {
      success: true,
      data: {
        bookingId: 'EMG-A4X9K2',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        address: '123 Main Street, Anytown',
        serviceType: 'emergency',
        bagCount: '1-5',
        status: 'scheduled',
        estimatedPrice: 50,
        specialInstructions: 'Behind the garage',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
    example: {
      success: false,
      message: 'Booking not found',
    },
  })
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    
    return {
      success: true,
      data: booking,
    };
  }

  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  @Roles('driver', 'admin')
  @ApiOperation({
    summary: 'Update booking status',
    description: 'Updates the status of a booking, typically used by drivers to track pickup progress.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the booking to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateBookingStatusDto,
    description: 'Status update information',
    examples: {
      startPickup: {
        summary: 'Start Pickup',
        description: 'Driver starts the pickup process',
        value: {
          status: 'in-progress',
          driverNotes: 'Arrived at location, beginning pickup',
        },
      },
      completePickup: {
        summary: 'Complete Pickup',
        description: 'Driver completes the pickup',
        value: {
          status: 'completed',
          driverNotes: 'Pickup completed successfully',
          actualPrice: 55.00,
          paymentMethod: 'credit_card',
          paymentStatus: 'paid',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Booking status updated successfully',
    example: {
      success: true,
      message: 'Booking status updated successfully',
      data: {
        bookingId: 'EMG-A4X9K2',
        status: 'completed',
        actualPrice: 55.00,
      },
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    const booking = await this.bookingsService.updateStatus(id, updateStatusDto);
    
    return {
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    };
  }

  @Patch(':id/assign-driver')
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'driver') // Temporarily allow drivers for testing
  @ApiOperation({
    summary: 'Assign driver to booking',
    description: 'Assigns a driver to a booking for pickup execution.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the booking',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    description: 'Driver assignment data',
    schema: {
      type: 'object',
      properties: {
        driverId: {
          type: 'string',
          description: 'ID of the driver to assign',
          example: 'D0001',
        },
      },
      required: ['driverId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Driver assigned successfully',
    example: {
      success: true,
      message: 'Driver assigned successfully',
      data: {
        bookingId: 'EMG-A4X9K2',
        driverId: 'D0001',
        status: 'scheduled',
      },
    },
  })
  async assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    const booking = await this.bookingsService.assignDriver(id, driverId);
    
    return {
      success: true,
      message: 'Driver assigned successfully',
      data: booking,
    };
  }
} 