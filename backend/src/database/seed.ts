import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { DriversService } from '../drivers/drivers.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const bookingsService = app.get(BookingsService);
  const driversService = app.get(DriversService);

  console.log('🌱 Seeding database...');

  try {
    // Check if sample driver already exists
    const existingDriver = await usersService.findByEmail('driver@rapidwaste.com');
    
    let driver;
    if (existingDriver) {
      console.log('ℹ️  Sample driver already exists, skipping creation...');
    } else {
      // Create sample driver (this will create both user and driver records with proper password hashing)
      driver = await driversService.createDriver(
        {
          firstName: 'John',
          lastName: 'Driver',
          email: 'driver@rapidwaste.com',
          phone: '(555) 123-4567',
          password: 'password123',
        },
        {
          vehicleInfo: {
            make: 'Ford',
            model: 'Transit',
            year: 2022,
            licensePlate: 'RW-001',
            capacity: 'Large',
          },
          workingHours: {
            start: '08:00',
            end: '18:00',
          },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          status: 'available',
        }
      );

      console.log('✅ Driver created:', driver.driverId);
    }

    // Check if admin user already exists
    const existingAdmin = await usersService.findByEmail('admin@rapidwaste.com');
    
    if (existingAdmin) {
      console.log('ℹ️  Sample admin already exists, skipping creation...');
    } else {
      // Create sample admin user
      const admin = await usersService.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rapidwaste.com',
        phone: '(555) 999-0000',
        password: 'admin123',
        role: 'admin',
      });

      console.log('✅ Admin created:', admin.email);
    }

    // Check if sample bookings already exist
    const existingBookings = await bookingsService.findAll();
    
    if (existingBookings.length > 0) {
      console.log('ℹ️  Sample bookings already exist, skipping creation...');
    } else {
      // Get the driver's user ID for assignment
      const driverUser = await usersService.findByEmail('driver@rapidwaste.com');
      const driverUserId = driverUser.id;

      // Create sample customers and bookings
      const sampleBookings = [
        // Emergency - In Progress (assigned to driver)
        {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@example.com',
          phone: '(555) 123-4567',
          address: '1234 Oak Street',
          city: 'Downtown',
          zipCode: '12345',
          serviceType: 'emergency',
          bagCount: '1-5',
          preferredDate: new Date().toISOString().split('T')[0], // Today for emergency
          preferredTime: 'Next 2 hours',
          specialInstructions: 'Behind garage, use side gate',
          urgentPickup: true,
          status: 'in-progress',
          driverId: driverUserId,
        },
        // Regular - Scheduled (assigned to driver)
        {
          firstName: 'Mike',
          lastName: 'Chen',
          email: 'mike@example.com',
          phone: '(555) 987-6543',
          address: '5678 Pine Avenue',
          city: 'Suburbs',
          zipCode: '67890',
          serviceType: 'regular',
          bagCount: '6-10',
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          preferredTime: '10:00 AM',
          specialInstructions: 'Front curb pickup',
          urgentPickup: false,
          status: 'scheduled',
          driverId: driverUserId,
        },
        // Bulk - Completed (assigned to driver)
        {
          firstName: 'Jennifer',
          lastName: 'Smith',
          email: 'jennifer@example.com',
          phone: '(555) 456-7890',
          address: '9012 Maple Drive',
          city: 'East Side',
          zipCode: '11111',
          serviceType: 'bulk',
          bagCount: '11+',
          preferredDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
          preferredTime: '2:00 PM',
          specialInstructions: 'Old couch and dining table, call upon arrival',
          urgentPickup: false,
          status: 'completed',
          driverId: driverUserId,
        },
        // Emergency - Pending (assigned to driver)
        {
          firstName: 'Robert',
          lastName: 'Wilson',
          email: 'robert@example.com',
          phone: '(555) 321-0987',
          address: '3456 Cedar Lane',
          city: 'North',
          zipCode: '22222',
          serviceType: 'emergency',
          bagCount: '1-5',
          preferredDate: new Date().toISOString().split('T')[0], // Today for emergency
          preferredTime: 'Today by 6 PM',
          specialInstructions: 'Apartment building, unit 4B',
          urgentPickup: false,
          status: 'pending',
          driverId: driverUserId,
        },
        // Regular - Cancelled (assigned to driver)
        {
          firstName: 'Lisa',
          lastName: 'Garcia',
          email: 'lisa.garcia@example.com',
          phone: '(555) 555-1234',
          address: '7890 Elm Street',
          city: 'Westside',
          zipCode: '33333',
          serviceType: 'regular',
          bagCount: '1-5',
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          preferredTime: '4:00 PM',
          specialInstructions: 'Ring doorbell twice',
          urgentPickup: false,
          status: 'cancelled',
          driverId: driverUserId,
        },
        // Emergency - Completed (assigned to driver)
        {
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@example.com',
          phone: '(555) 888-9999',
          address: '1111 Main Street',
          city: 'Downtown',
          zipCode: '44444',
          serviceType: 'emergency',
          bagCount: '6-10',
          preferredDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
          preferredTime: 'Next 4 hours',
          specialInstructions: 'Commercial building, loading dock access',
          urgentPickup: true,
          status: 'completed',
          driverId: driverUserId,
        },
        // Bulk - Scheduled (not assigned - available for assignment)
        {
          firstName: 'Amanda',
          lastName: 'Martinez',
          email: 'amanda@example.com',
          phone: '(555) 777-8888',
          address: '2468 Broadway',
          city: 'Midtown',
          zipCode: '55555',
          serviceType: 'bulk',
          bagCount: '11+',
          preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
          preferredTime: '12:00 PM',
          specialInstructions: 'Large appliances - refrigerator and washing machine',
          urgentPickup: false,
          status: 'scheduled',
          // No driverId - available for assignment
        },
        // Regular - In Progress (assigned to driver)
        {
          firstName: 'Kevin',
          lastName: 'Lee',
          email: 'kevin.lee@example.com',
          phone: '(555) 333-4444',
          address: '3579 Oak Avenue',
          city: 'Eastside',
          zipCode: '66666',
          serviceType: 'regular',
          bagCount: '6-10',
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: '8:00 AM',
          specialInstructions: 'Weekly pickup, bags in alley',
          urgentPickup: false,
          status: 'in-progress',
          driverId: driverUserId,
        },
        // Emergency - Scheduled (assigned to driver)
        {
          firstName: 'Maria',
          lastName: 'Rodriguez',
          email: 'maria@example.com',
          phone: '(555) 222-3333',
          address: '4680 Sunset Blvd',
          city: 'Hollywood',
          zipCode: '77777',
          serviceType: 'emergency',
          bagCount: '1-5',
          preferredDate: new Date().toISOString().split('T')[0], // Today
          preferredTime: 'Today by 6 PM',
          specialInstructions: 'Office building cleanup after water damage',
          urgentPickup: true,
          status: 'scheduled',
          driverId: driverUserId,
        },
        // Bulk - Pending (not assigned - available for assignment)
        {
          firstName: 'James',
          lastName: 'Taylor',
          email: 'james.taylor@example.com',
          phone: '(555) 111-2222',
          address: '5791 Pine Street',
          city: 'Southside',
          zipCode: '88888',
          serviceType: 'bulk',
          bagCount: '11+',
          preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
          preferredTime: '10:00 AM',
          specialInstructions: 'Construction debris from home renovation',
          urgentPickup: false,
          status: 'pending',
          // No driverId - available for assignment
        },
      ];

      for (const bookingData of sampleBookings) {
        const booking = await bookingsService.createBooking(bookingData);
        console.log('✅ Booking created:', booking.bookingId);
      }
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data Available:');
    console.log('- Admin: admin@rapidwaste.com / admin123');
    console.log('- Driver: driver@rapidwaste.com / password123');
    console.log('- Sample bookings with different service types');
    console.log('\n🚀 You can now start the backend server!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }

  await app.close();
}

seed(); 