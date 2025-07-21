import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeConfig } from '../config/stripe.config';
import { Booking, BookingSchema } from '../database/schemas/booking.schema';
import { User, UserSchema } from '../database/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'rapidwaste-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeConfig],
  exports: [PaymentsService],
})
export class PaymentsModule {} 