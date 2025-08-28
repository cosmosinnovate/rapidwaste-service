import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Booking, BookingDocument } from '../database/schemas/booking.schema';

@Injectable()
export class NotaryService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async getNotaryDashboard(notaryId: string): Promise<any> {
    const notary = await this.userModel.findById(notaryId);
    
    if (!notary || notary.role !== 'notary') {
      throw new NotFoundException('Notary not found');
    }

    // Get today's bookings (by preferred date or creation date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const notaryObjectId = new Types.ObjectId(notaryId);

    const todaysBookings = await this.bookingModel
      .find({
        driverId: notaryObjectId,
        $or: [
          { preferredDate: { $gte: today, $lt: tomorrow } },
          { createdAt: { $gte: today, $lt: tomorrow } }
        ]
      })
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();

    // Calculate today's stats
    const completedToday = todaysBookings.filter(b => b.status === 'documents-ready');
    const todaysEarnings = completedToday.reduce((sum, booking) => sum + (booking.price || 0), 0);

    return {
      notary: {
        id: notary.id,
        name: `${notary.firstName} ${notary.lastName}`,
        email: notary.email,
        role: notary.role,
      },
      todaysStats: {
        totalBookings: todaysBookings.length,
        completedBookings: completedToday.length,
        pendingBookings: todaysBookings.filter(b => ['pending', 'scheduled'].includes(b.status)).length,
        activeBookings: todaysBookings.filter(b => b.status === 'session-active').length,
        earnings: todaysEarnings,
      },
      bookings: todaysBookings,
    };
  }

  async getNotaryBookings(notaryId: string, status?: string, date?: string): Promise<Booking[]> {
    const notary = await this.userModel.findById(notaryId);
    
    if (!notary || notary.role !== 'notary') {
      throw new NotFoundException('Notary not found');
    }

    // Build the base query with notary filter
    const query: any = { driverId: notaryId };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Add date filter if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Add date condition that matches either preferred date or creation date
      query.$or = [
        { preferredDate: { $gte: startOfDay, $lte: endOfDay } },
        { createdAt: { $gte: startOfDay, $lte: endOfDay } }
      ];
    }

    const results = await this.bookingModel
      .find(query)
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();
    
    return results;
  }

  async getAvailableNotaries(): Promise<User[]> {
    return this.userModel
      .find({ role: 'notary', isActive: true })
      .select('firstName lastName email phone')
      .exec();
  }
}
