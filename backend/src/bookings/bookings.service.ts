import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../database/schemas/booking.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateBookingDto } from '../common/dto/create-booking.dto';
import { UpdateBookingStatusDto } from '../common/dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { tenantId } = createBookingDto;

    // Fetch tenant settings for dynamic pricing
    const tenant = await this.userModel.db.model('Tenant').findById(tenantId);
    const settings = tenant?.settings || {
      basePriceRegular: 800,
      basePriceEmergency: 1200,
      basePriceBulk: 450,
    };

    // Calculate price
    const estimatedPrice = this.calculatePrice(
      createBookingDto.serviceType,
      createBookingDto.bagCount,
      createBookingDto.urgentPickup || false,
      settings,
      createBookingDto.preferredTime
    );

    // Generate booking ID
    const bookingId = this.generateBookingId(createBookingDto.serviceType);

    // Set priority based on service type
    const priority = createBookingDto.serviceType === 'emergency' ? 'high' : 'medium';

    // Create customer if doesn't exist for this tenant
    let customer = await this.userModel.findOne({ 
      email: createBookingDto.email,
      tenantId 
    });
    
    if (!customer) {
      customer = new this.userModel({
        tenantId,
        firstName: createBookingDto.firstName,
        lastName: createBookingDto.lastName,
        email: createBookingDto.email,
        phone: createBookingDto.phone,
        password: 'temp_password', // In real app, would require proper registration
        role: 'customer',
      });
      await customer.save();
    }

    const booking = new this.bookingModel({
      ...createBookingDto,
      bookingId,
      customerId: customer.id,
      customerName: `${createBookingDto.firstName} ${createBookingDto.lastName}`,
      estimatedPrice,
      priority,
      status: (createBookingDto as any).status || 'pending', // Allow status override for seeding
      driverId: (createBookingDto as any).driverId || undefined, // Allow driver assignment for seeding
    });

    return booking.save();
  }

  async findAll(tenantId: string, filters?: any): Promise<Booking[]> {
    const query = { tenantId: new Types.ObjectId(tenantId) };
    
    if (filters?.status) {
      query['status'] = filters.status;
    }
    
    if (filters?.serviceType) {
      query['serviceType'] = filters.serviceType;
    }
    
    if (filters?.driverId) {
      query['driverId'] = new Types.ObjectId(filters.driverId);
    }
    
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query['createdAt'] = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    return this.bookingModel
      .find(query)
      .populate('customerId', 'firstName lastName email phone')
      .populate('driverId', 'firstName lastName driverId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(tenantId: string, id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findOne({ _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) })
      .populate('customerId', 'firstName lastName email phone')
      .populate('driverId', 'firstName lastName driverId')
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(tenantId: string, id: string, updateStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ 
      _id: new Types.ObjectId(id), 
      tenantId: new Types.ObjectId(tenantId) 
    });
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate status transition
    this.validateStatusTransition(booking.status, updateStatusDto.status);

    const updateData = { ...updateStatusDto };
    
    if (updateStatusDto.status === 'completed') {
      updateData['completedAt'] = new Date();
    }

    const updatedBooking = await this.bookingModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) }, 
        updateData, 
        { new: true }
      )
      .populate('customerId', 'firstName lastName email phone')
      .populate('driverId', 'firstName lastName driverId')
      .exec();

    return updatedBooking;
  }

  async assignDriver(tenantId: string, bookingId: string, driverId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ 
      _id: new Types.ObjectId(bookingId), 
      tenantId: new Types.ObjectId(tenantId) 
    });
    const driver = await this.userModel.findOne({ 
      _id: new Types.ObjectId(driverId), 
      tenantId: new Types.ObjectId(tenantId) 
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!driver || driver.role !== 'driver') {
      throw new BadRequestException('Invalid driver');
    }

    booking.driverId = driver.id;
    booking.status = 'scheduled';
    
    return booking.save();
  }

  async getStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<any> {
    if (!tenantId || !Types.ObjectId.isValid(tenantId)) {
      return {
        totalBookings: 0,
        totalRevenue: 0,
        completedBookings: 0,
        pendingBookings: 0,
        emergencyBookings: 0,
      };
    }
    const matchQuery: any = { tenantId: new Types.ObjectId(tenantId) };
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const stats = await this.bookingModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$estimatedPrice' },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          emergencyBookings: {
            $sum: { $cond: [{ $eq: ['$serviceType', 'emergency'] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      completedBookings: 0,
      pendingBookings: 0,
      emergencyBookings: 0,
    };
  }

  private calculatePrice(
    serviceType: string, 
    bagCount: string, 
    urgentPickup: boolean, 
    settings: any,
    preferredTime?: string
  ): number {
    const basePrices = {
      regular: settings.basePriceRegular || 800,
      emergency: settings.basePriceEmergency || 1200,
      bulk: settings.basePriceBulk || 450,
    };

    const bagPricing = {
      '1-5': 0,
      '6-10': 50,
      '11+': 100,
    };

    const emergencyTimeFees = {
      'Next 2 hours': 100,
      'Next 4 hours': 50,
      'Today by 6 PM': 0,
    };

    const basePrice = basePrices[serviceType] || basePrices.regular;
    const bagSurcharge = bagPricing[bagCount] || 0;
    const urgentFee = urgentPickup ? 150 : 0;
    
    const emergencyTimeFee = serviceType === 'emergency' && preferredTime
      ? (emergencyTimeFees[preferredTime] || 0)
      : 0;

    return basePrice + bagSurcharge + urgentFee + emergencyTimeFee;
  }

  private generateBookingId(serviceType: string): string {
    const prefix = serviceType === 'emergency' ? 'EMG' : 
                   serviceType === 'bulk' ? 'BLK' : 'REG';
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${random}`;
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions = {
      pending: ['scheduled', 'cancelled'],
      scheduled: ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
} 