import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { DriversModule } from './drivers/drivers.module';
import { BookingsGateway } from './gateways/bookings.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/rapidwaste'
    ),
    AuthModule,
    UsersModule,
    BookingsModule,
    DriversModule,
  ],
  providers: [BookingsGateway],
})
export class AppModule {} 