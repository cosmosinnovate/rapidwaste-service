import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  private validateTenantId(tenantId: string) {
    if (!tenantId || !Types.ObjectId.isValid(tenantId)) {
      throw new BadRequestException('Invalid or missing Tenant ID');
    }
  }

  async getDriverDashboard(tenantId: string, driverId: string): Promise<any> {
    this.validateTenantId(tenantId);
    
    const driver = await this.driverModel
      .findOne({ driverId, tenantId: new Types.ObjectId(tenantId) })
      .populate('userId');
    
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const driverObjectId = new Types.ObjectId(driver.userId as any);

    const todaysBookings = await this.bookingModel
      .find({
        tenantId: new Types.ObjectId(tenantId),
        driverId: driverObjectId,
        $or: [
          { preferredDate: { $gte: today, $lt: tomorrow } },
          { createdAt: { $gte: today, $lt: tomorrow } }
        ]
      })
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();

    const completedToday = todaysBookings.filter(b => b.status === 'completed');
    const todaysEarnings = completedToday.reduce((sum, booking) => sum + (booking.actualPrice || booking.estimatedPrice), 0);

    return {
      driver: {
        id: driver.driverId,
        name: `${(driver.userId as any).firstName} ${(driver.userId as any).lastName}`,
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

  async getDriverBookings(tenantId: string, driverId: string, status?: string, date?: string): Promise<Booking[]> {
    this.validateTenantId(tenantId);

    const driver = await this.driverModel.findOne({ 
      driverId, 
      tenantId: new Types.ObjectId(tenantId) 
    });
    
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const query: any = { 
      tenantId: new Types.ObjectId(tenantId),
      driverId: driver.userId 
    };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.$or = [
        { preferredDate: { $gte: startOfDay, $lte: endOfDay } },
        { createdAt: { $gte: startOfDay, $lte: endOfDay } }
      ];
    }

    return this.bookingModel
      .find(query)
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateDriverStatus(tenantId: string, driverId: string, status: string): Promise<Driver> {
    this.validateTenantId(tenantId);

    const driver = await this.driverModel.findOneAndUpdate(
      { driverId, tenantId: new Types.ObjectId(tenantId) },
      { status, lastActiveAt: new Date() },
      { new: true }
    );

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async updateLocation(tenantId: string, driverId: string, lat: number, lng: number): Promise<Driver> {
    this.validateTenantId(tenantId);

    const driver = await this.driverModel.findOneAndUpdate(
      { driverId, tenantId: new Types.ObjectId(tenantId) },
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

  async getAvailableDrivers(tenantId: string): Promise<Driver[]> {
    if (!tenantId || !Types.ObjectId.isValid(tenantId)) return [];

    return this.driverModel
      .find({ 
        tenantId: new Types.ObjectId(tenantId),
        status: 'available', 
        isActive: true 
      })
      .populate('userId', 'firstName lastName email phone')
      .exec();
  }

  async getAllDrivers(tenantId: string): Promise<any[]> {
    if (!tenantId || !Types.ObjectId.isValid(tenantId)) return [];

    const drivers = await this.driverModel
      .find({ 
        tenantId: new Types.ObjectId(tenantId),
        isActive: true 
      })
      .populate('userId', 'firstName lastName email phone driverId role')
      .exec();

    return drivers.map(driver => {
      const pDriver = driver as any;
      const user = pDriver.userId as any;
      
      return {
        _id: user?._id || pDriver._id,
        firstName: user?.firstName || 'Unknown',
        lastName: user?.lastName || 'Driver',
        email: user?.email,
        phone: user?.phone,
        role: user?.role,
        driverId: user?.driverId || pDriver.driverId,
        status: pDriver.status,
        vehicleInfo: pDriver.vehicleInfo,
        workingHours: pDriver.workingHours,
        workingDays: pDriver.workingDays,
        isActive: pDriver.isActive,
        createdAt: pDriver.createdAt,
        updatedAt: pDriver.updatedAt,
      };
    });
  }

  async createDriver(tenantId: string, userData: any, driverData: any): Promise<Driver> {
    this.validateTenantId(tenantId);

    const driverCount = await this.driverModel.countDocuments({ 
      tenantId: new Types.ObjectId(tenantId) 
    });
    const driverId = `D${String(driverCount + 1).padStart(4, '0')}`;

    const user = await this.usersService.create({
      ...userData,
      tenantId: new Types.ObjectId(tenantId),
      role: 'driver',
      driverId: driverId,
    });

    const driver = new this.driverModel({
      ...driverData,
      tenantId: new Types.ObjectId(tenantId),
      userId: user._id,
      driverId,
    });

    return driver.save();
  }
}
