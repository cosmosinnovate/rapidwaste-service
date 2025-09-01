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
    summary: 'Create a new notary booking',
    description: 'Creates a new booking for a notary session. Generates a booking ID.',
  })
  @ApiBody({
    type: CreateBookingDto,
    description: 'Booking details including customer information and appointment time.',
    examples: {
      standardBooking: {
        summary: 'Standard Notary Booking',
        description: 'Example of a standard notary booking',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          specialInstructions: 'I have two documents to be notarized.',
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
        bookingId: 'NTRY-A4X9K2',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        status: 'scheduled',
        priority: 'normal',
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
    description: 'Retrieves all bookings with optional filtering by status or date.',
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
    description: 'Filter by booking date (YYYY-MM-DD)',
    example: '2024-12-25',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bookings retrieved successfully',
    example: {
      success: true,
      data: [
        {
          bookingId: 'NTRY-A4X9K2',
          customerName: 'John Doe',
          status: 'scheduled',
        },
      ],
      count: 1,
    },
  })
  async findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const filters = {
      ...(status && { status }),
      ...(date && { date }),
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
  @Roles('admin')
  @ApiOperation({
    summary: 'Get booking statistics',
    description: 'Retrieves aggregate statistics about notary bookings for the analytics dashboard.',
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
        canceledBookings: 10,
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
        bookingId: 'NTRY-A4X9K2',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        status: 'scheduled',
        specialInstructions: 'I have two documents to be notarized.',
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
  @Roles('admin')
  @ApiOperation({
    summary: 'Update booking status',
    description: 'Updates the status of a booking, used by admins or notaries to track session progress.',
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
      startSession: {
        summary: 'Start Session',
        description: 'Notary starts the session',
        value: {
          status: 'session-active',
          notes: 'Session started with client.',
        },
      },
      completeSession: {
        summary: 'Complete Session',
        description: 'Notary completes the session',
        value: {
          status: 'documents-ready',
          notes: 'Session completed successfully, documents are notarized.',
          actualPrice: 75.00,
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
        bookingId: 'NTRY-A4X9K2',
        status: 'documents-ready',
        actualPrice: 75.00,
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
}