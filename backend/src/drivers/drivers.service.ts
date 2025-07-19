import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Driver, DriverDocument } from '../database/schemas/driver.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Booking, BookingDocument } from '../database/schemas/booking.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private usersService: UsersService,
  ) {}

  async getDriverDashboard(driverId: string): Promise<any> {
    const driver = await this.driverModel.findOne({ driverId }).populate('userId');
    
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Get today's bookings (by preferred date or creation date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const driverObjectId = new Types.ObjectId(driver.userId);

    const todaysBookings = await this.bookingModel
      .find({
        driverId: driverObjectId,
        $or: [
          { preferredDate: { $gte: today, $lt: tomorrow } },
          { createdAt: { $gte: today, $lt: tomorrow } }
        ]
      })
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();

    // Calculate today's stats
    const completedToday = todaysBookings.filter(b => b.status === 'completed');
    const todaysEarnings = completedToday.reduce((sum, booking) => sum + (booking.actualPrice || booking.estimatedPrice), 0);

    return {
      driver: {
        id: driver.driverId,
        name: `${driver.userId['firstName']} ${driver.userId['lastName']}`,
        status: driver.status,
        rating: driver.rating,
        vehicle: driver.vehicleInfo,
      },
      todaysStats: {
        totalBookings: todaysBookings.length,
        completedBookings: completedToday.length,
        pendingBookings: todaysBookings.filter(b => ['pending', 'scheduled'].includes(b.status)).length,
        inProgressBookings: todaysBookings.filter(b => b.status === 'in-progress').length,
        earnings: todaysEarnings,
      },
      bookings: todaysBookings,
    };
  }

  async getDriverBookings(driverId: string, status?: string, date?: string): Promise<Booking[]> {
    const driver = await this.driverModel.findOne({ driverId });
    
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Build the base query with driver filter
    const query: any = { driverId: driver.userId };
    
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
      
      console.log('Date filter debug:');
      console.log('Input date:', date);
      console.log('Start of day:', startOfDay);
      console.log('End of day:', endOfDay);
      
      // Add date condition that matches either preferred date or creation date
      query.$or = [
        { preferredDate: { $gte: startOfDay, $lte: endOfDay } },
        { createdAt: { $gte: startOfDay, $lte: endOfDay } }
      ];
      
      console.log('Date query $or:', JSON.stringify(query.$or, null, 2));
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const results = await this.bookingModel
      .find(query)
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();
    
    return results;
  }

  async updateDriverStatus(driverId: string, status: string): Promise<Driver> {
    const driver = await this.driverModel.findOneAndUpdate(
      { driverId },
      { status, lastActiveAt: new Date() },
      { new: true }
    );

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async updateLocation(driverId: string, lat: number, lng: number): Promise<Driver> {
    const driver = await this.driverModel.findOneAndUpdate(
      { driverId },
      {
        currentLocation: {
          lat,
          lng,
          timestamp: new Date(),
        },
        lastActiveAt: new Date(),
      },
      { new: true }
    );

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async getAvailableDrivers(): Promise<Driver[]> {
    return this.driverModel
      .find({ status: 'available', isActive: true })
      .populate('userId', 'firstName lastName email phone')
      .exec();
  }

  async getAllDrivers(): Promise<any[]> {
    // Get all drivers from driver collection with user details
    const drivers = await this.driverModel
      .find({ isActive: true })
      .populate('userId', 'firstName lastName email phone driverId role')
      .exec();

    // Format the response to include user and driver details
    return drivers.map(driver => ({
      _id: driver.userId._id,
      firstName: driver.userId.firstName,
      lastName: driver.userId.lastName,
      email: driver.userId.email,
      phone: driver.userId.phone,
      role: driver.userId.role,
      driverId: driver.userId.driverId || driver.driverId,
      status: driver.status,
      vehicleInfo: driver.vehicleInfo,
      workingHours: driver.workingHours,
      workingDays: driver.workingDays,
      isActive: driver.isActive,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    }));
  }

  async createDriver(userData: any, driverData: any): Promise<Driver> {
    // Generate driver ID first
    const driverCount = await this.driverModel.countDocuments();
    const driverId = `D${String(driverCount + 1).padStart(4, '0')}`;

    // Create user first using UsersService (which handles password hashing)
    const user = await this.usersService.create({
      ...userData,
      role: 'driver',
      driverId: driverId,
    });

    // Create driver profile
    const driver = new this.driverModel({
      ...driverData,
      userId: user._id,
      driverId,
    });

    return driver.save();
  }
} 