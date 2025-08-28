import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotaryService } from './notary.service';
import { NotaryController } from './notary.controller';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../database/schemas/user.schema';
import { Booking, BookingSchema } from '../database/schemas/booking.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [NotaryController],
  providers: [NotaryService],
  exports: [NotaryService],
})
export class NotaryModule {}
