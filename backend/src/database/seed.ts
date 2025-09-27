import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { ConfigModule } from '@nestjs/config';

async function seed() {
  // Load environment variables
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      isGlobal: true,
    })
  );
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const bookingsService = app.get(BookingsService);

  console.log('🌱 Seeding database...');
  console.log('📊 MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/notarynow');

  // Check if we should force re-seed (clear existing data)
  const forceReseed = process.argv.includes('--force') || process.argv.includes('-f');
  
  try {
    // Check if sample notary already exists
    const existingNotary = await usersService.findByEmail('notary@notarynow.com');
    
    let notary;
    if (existingNotary) {
      console.log('ℹ️  Sample notary already exists, skipping creation...');
      notary = existingNotary;
    } else {
      // Create sample notary user directly
      notary = await usersService.create({
        firstName: 'Sarah',
        lastName: 'Notary',
        email: 'notary@notarynow.com',
        phone: '(555) 123-4567',
        password: 'password123',
        role: 'notary',
      });

      console.log('✅ Notary created:', notary.email);
    }

    // Check if admin user already exists
    const existingAdmin = await usersService.findByEmail('admin@notarynow.com');
    
    if (existingAdmin) {
      console.log('ℹ️  Sample admin already exists, skipping creation...');
    } else {
      // Create sample admin user
      const admin = await usersService.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@notarynow.com',
        phone: '(555) 999-0000',
        password: 'admin123',
        role: 'admin',
      });

      console.log('✅ Admin created:', admin.email);
    }

    // Check if super admin user already exists
    const existingSuperAdmin = await usersService.findByEmail('superadmin@notarynow.com');

    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin already exists, skipping creation...');
    } else {
      // Create super admin user (use secure credentials in production)
      const superAdmin = await usersService.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@notarynow.com',
        phone: '(555) 000-0000',
        password: 'superadmin123',
        role: 'super_admin',
      });

      console.log('✅ Super admin created:', superAdmin.email);
    }

    // Check if sample bookings already exist
    const existingBookings = await bookingsService.findAll();
    
    if (existingBookings.length > 0 && !forceReseed) {
      console.log('ℹ️  Sample bookings already exist, skipping creation...');
      console.log('💡 Use --force flag to clear existing data and re-seed');
    } else {
      if (forceReseed && existingBookings.length > 0) {
        console.log('🗑️  Force flag detected, clearing existing bookings...');
        // Clear existing bookings using mongoose model directly
        const { default: mongoose } = await import('mongoose');
        const bookingModel = mongoose.connection.model('Booking');
        await bookingModel.deleteMany({});
        console.log(`✅ Cleared ${existingBookings.length} existing bookings`);
      }
      
      // Create sample bookings with proper customer data
      const sampleBookings = [
        // General Notary - In Progress (assigned to notary)
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '(555) 123-4567',
          address: '1234 Oak Street',
          city: 'Downtown',
          zipCode: '12345',
          serviceType: 'general',
          documentCount: 3,
          witnesses: 0,
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: '10:00 AM',
          specialInstructions: 'Power of Attorney documents',
          status: 'session-active',
          priority: 'medium',
          price: 55, // $15 per signature + $10 service fee
        },
        // Loan Signing - Scheduled (assigned to notary)
        {
          firstName: 'Maria',
          lastName: 'Garcia',
          email: 'maria.garcia@example.com',
          phone: '(555) 987-6543',
          address: '5678 Pine Avenue',
          city: 'Suburbs',
          zipCode: '67890',
          serviceType: 'loan_signing',
          documentCount: 15,
          witnesses: 1,
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          preferredTime: '2:00 PM',
          specialInstructions: 'First-time homebuyer loan package',
          status: 'scheduled',
          priority: 'high',
          price: 200,
        },
        // Estate Planning - Completed (assigned to notary)
        {
          firstName: 'Robert',
          lastName: 'Johnson',
          email: 'robert.johnson@example.com',
          phone: '(555) 456-7890',
          address: '9012 Maple Drive',
          city: 'East Side',
          zipCode: '11111',
          serviceType: 'estate_planning',
          documentCount: 8,
          witnesses: 2,
          preferredDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
          preferredTime: '11:00 AM',
          specialInstructions: 'Trust documents and will notarization',
          status: 'documents-ready',
          priority: 'medium',
          price: 320,
        },
        // General Notary - Pending (assigned to notary)
        {
          firstName: 'Lisa',
          lastName: 'Brown',
          email: 'lisa.brown@example.com',
          phone: '(555) 321-0987',
          address: '3456 Cedar Lane',
          city: 'North',
          zipCode: '22222',
          serviceType: 'general',
          documentCount: 1,
          witnesses: 0,
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: '4:00 PM',
          specialInstructions: 'Affidavit notarization',
          status: 'pending',
          priority: 'low',
          price: 25,
        },
        // Loan Signing - Cancelled (assigned to notary)
        {
          firstName: 'David',
          lastName: 'Wilson',
          email: 'david.wilson@example.com',
          phone: '(555) 555-1234',
          address: '7890 Elm Street',
          city: 'Westside',
          zipCode: '33333',
          serviceType: 'loan_signing',
          documentCount: 12,
          witnesses: 1,
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          preferredTime: '3:00 PM',
          specialInstructions: 'Refinance loan documents',
          status: 'canceled',
          priority: 'medium',
          price: 175,
        },
        // Estate Planning - Scheduled (not assigned - available for assignment)
        {
          firstName: 'Amanda',
          lastName: 'Martinez',
          email: 'amanda@example.com',
          phone: '(555) 777-8888',
          address: '2468 Broadway',
          city: 'Midtown',
          zipCode: '55555',
          serviceType: 'estate_planning',
          documentCount: 6,
          witnesses: 1,
          preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
          preferredTime: '1:00 PM',
          specialInstructions: 'Estate planning documents for elderly couple',
          status: 'scheduled',
          priority: 'high',
          price: 280,
        },
        // General Notary - In Progress (assigned to notary)
        {
          firstName: 'Kevin',
          lastName: 'Lee',
          email: 'kevin.lee@example.com',
          phone: '(555) 333-4444',
          address: '3579 Oak Avenue',
          city: 'Eastside',
          zipCode: '66666',
          serviceType: 'general',
          documentCount: 2,
          witnesses: 0,
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: '9:00 AM',
          specialInstructions: 'Contract notarization',
          status: 'session-active',
          priority: 'medium',
          price: 40,
        },
        // Loan Signing - Scheduled (assigned to notary)
        {
          firstName: 'Jennifer',
          lastName: 'Taylor',
          email: 'jennifer@example.com',
          phone: '(555) 222-3332',
          address: '4680 Sunset Blvd',
          city: 'Hollywood',
          zipCode: '77777',
          serviceType: 'loan_signing',
          documentCount: 18,
          witnesses: 2,
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: '3:00 PM',
          specialInstructions: 'Commercial property loan package',
          status: 'scheduled',
          priority: 'high',
          price: 225,
        },
        // General Notary - Pending (not assigned - available for assignment)
        {
          firstName: 'James',
          lastName: 'Anderson',
          email: 'james.anderson@example.com',
          phone: '(555) 111-2222',
          address: '5791 Pine Street',
          city: 'Southside',
          zipCode: '88888',
          serviceType: 'general',
          documentCount: 4,
          witnesses: 0,
          preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
          preferredTime: '10:00 AM',
          specialInstructions: 'Multiple affidavit notarizations',
          status: 'pending',
          priority: 'low',
          price: 70,
        },
      ];

      for (const bookingData of sampleBookings) {
        const booking = await bookingsService.createBooking(bookingData);
        console.log('✅ Notarization session created:', booking.bookingId, `for ${bookingData.firstName} ${bookingData.lastName}`);
      }
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data Available:');
    console.log('- Admin: admin@notarynow.com / admin123');
    console.log('- Notary: notary@notarynow.com / password123');
    console.log('- Sample notarization sessions with different service types:');
    console.log('  • General Notary Work');
    console.log('  • Loan Documents');
    console.log('  • Estate Planning');
    console.log('\n🚀 You can now start the backend server!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }

  await app.close();
}

seed(); 