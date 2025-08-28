import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    // Generate booking ID
    const bookingId = this.generateBookingId();

    // Priority can be determined by other logic, e.g., based on serviceType or special request
    const priority = 'medium';

    // Create customer if doesn't exist
    let customer = await this.userModel.findOne({ email: createBookingDto.email });

    if (!customer) {
      customer = new this.userModel({
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
      price: createBookingDto.price, // Use price from DTO
      priority,
      status: 'pending',
    });

    return booking.save();
  }

  async findAll(filters?: any): Promise<Booking[]> {
    const query = {};
    
    if (filters?.status) {
      query['status'] = filters.status;
    }
    
    if (filters?.serviceType) {
      query['serviceType'] = filters.serviceType;
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
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('customerId', 'firstName lastName email phone')
      .exec();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate status transition
    this.validateStatusTransition(booking.status, updateStatusDto.status);

    const updateData = { ...updateStatusDto };
    
    if (updateStatusDto.status === 'documents-ready') {
      updateData['completedAt'] = new Date();
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('customerId', 'firstName lastName email phone')
      .exec();

    return updatedBooking;
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<any> {
    const matchQuery: any = {};
    
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
          totalRevenue: { $sum: '$price' }, // Use 'price' field
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'documents-ready'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      completedBookings: 0,
      pendingBookings: 0,
    };
  }

  private generateBookingId(): string {
    const prefix = 'NTRY';
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${random}`;
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions = {
      pending: ['scheduled', 'canceled'],
      scheduled: ['session-active', 'canceled'],
      'session-active': ['documents-ready', 'canceled'],
      'documents-ready': [],
      canceled: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }
}