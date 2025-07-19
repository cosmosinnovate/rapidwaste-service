import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Driver, DriverSchema } from '../database/schemas/driver.schema';
import { User, UserSchema } from '../database/schemas/user.schema';
import { Booking, BookingSchema } from '../database/schemas/booking.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    UsersModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {} 