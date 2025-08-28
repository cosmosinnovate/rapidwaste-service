import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { ConfigModule } from '@nestjs/config';
import { connect, connection } from 'mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { User, UserSchema } from './schemas/user.schema';

async function drop() {
  // Load environment variables
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      isGlobal: true,
    })
  );
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const bookingsService = app.get(BookingsService);

  console.log('🗑️  Dropping seeded database data...');
  console.log('📊 MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/notarynow');

  try {
    // Ensure we're connected to MongoDB
    if (connection.readyState !== 1) {
      console.log('🔌 Connecting to MongoDB...');
      await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notarynow');
    }

    // Register schemas if not already registered
    if (!connection.models.Booking) {
      connection.model(Booking.name, BookingSchema);
    }
    if (!connection.models.User) {
      connection.model(User.name, UserSchema);
    }

    // Clear all bookings
    const bookingModel = connection.model('Booking');
    const deletedBookings = await bookingModel.deleteMany({});
    console.log(`✅ Cleared ${deletedBookings.deletedCount} bookings`);

    // Clear seeded users (admin and notary)
    const userModel = connection.model('User');
    const deletedNotary = await userModel.deleteOne({ email: 'notary@notarynow.com' });
    if (deletedNotary.deletedCount > 0) {
      console.log('✅ Deleted sample notary user');
    }

    const deletedAdmin = await userModel.deleteOne({ email: 'admin@notarynow.com' });
    if (deletedAdmin.deletedCount > 0) {
      console.log('✅ Deleted sample admin user');
    }

    console.log('🎉 All seeded data dropped successfully!');
    console.log('\n💡 You can now run the seed script again to recreate the sample data:');
    console.log('   npm run seed');

  } catch (error) {
    console.error('❌ Error dropping database data:', error);
  }

  await app.close();
}

drop();
