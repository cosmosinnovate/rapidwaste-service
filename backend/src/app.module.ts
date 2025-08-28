import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotaryModule } from './notary/notary.module';
import { PaymentsModule } from './payments/payments.module';
import { BookingsGateway } from './gateways/bookings.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/notarynow',
      {
        // Add connection options for better error handling
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
          });
          connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
          });
          return connection;
        },
      }
    ),
    AuthModule,
    UsersModule,
    BookingsModule,
    NotaryModule,
    PaymentsModule,
  ],
  providers: [BookingsGateway],
})
export class AppModule {} 