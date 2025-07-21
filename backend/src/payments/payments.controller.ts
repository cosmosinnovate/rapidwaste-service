import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('create-intent/:bookingId')
  @ApiOperation({ summary: 'Create payment intent for a booking' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async createPaymentIntent(
    @Param('bookingId') bookingId: string,
  ) {
    const result = await this.paymentsService.createPaymentIntent(
      bookingId,
      null, // No customer ID needed for public booking
    );

    return {
      success: true,
      message: 'Payment intent created successfully',
      data: result,
    };
  }

  @Public()
  @Post('confirm/:paymentIntentId')
  @ApiOperation({ summary: 'Confirm payment completion' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Payment confirmation failed' })
  @ApiParam({ name: 'paymentIntentId', description: 'Stripe Payment Intent ID' })
  @HttpCode(HttpStatus.OK)
  async confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
    const result = await this.paymentsService.confirmPayment(paymentIntentId);
    
    return {
      success: result.success,
      message: result.message,
      data: result,
    };
  }

  @Public()
  @Get('status/:bookingId')
  @ApiOperation({ summary: 'Get payment status for a booking' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getPaymentStatus(@Param('bookingId') bookingId: string) {
    const status = await this.paymentsService.getPaymentStatus(bookingId);
    
    return {
      success: true,
      data: status,
    };
  }

  @Post('refund/:bookingId')
  @Roles('admin')
  @ApiOperation({ summary: 'Refund payment for a booking (Admin only)' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiBearerAuth()
  async refundPayment(
    @Param('bookingId') bookingId: string,
    @Body() body: { amount?: number },
  ) {
    const result = await this.paymentsService.refundPayment(
      bookingId,
      body.amount,
    );
    
    return {
      success: true,
      message: 'Refund processed successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('customer-portal')
  @ApiOperation({ summary: 'Create customer portal session' })
  @ApiResponse({ status: 200, description: 'Portal session created' })
  @ApiResponse({ status: 400, description: 'No Stripe customer found' })
  @ApiBearerAuth()
  async createCustomerPortalSession(@Request() req) {
    const customerId = req.user.sub;
    
    const result = await this.paymentsService.createCustomerPortalSession(
      customerId,
    );
    
    return {
      success: true,
      data: result,
    };
  }
} 