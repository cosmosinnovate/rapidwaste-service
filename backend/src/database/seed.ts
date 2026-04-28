import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { DriversService } from '../drivers/drivers.service';
import { TenantsService } from '../tenants/tenants.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const bookingsService = app.get(BookingsService);
  const driversService = app.get(DriversService);
  const tenantsService = app.get(TenantsService);

  console.log('🌱 Seeding database...');

  try {
    // 1. Create or get the default tenant
    let tenant;
    try {
      tenant = await tenantsService.findBySlug('rapidmoveclear');
      console.log('ℹ️  Default tenant already exists, skipping creation...');
    } catch (error) {
      tenant = await tenantsService.create({
        name: 'Rapid Move & Clear',
        slug: 'rapidmoveclear',
        contactEmail: 'admin@rapidmoveclear.com',
        phone: '(800) RAPID-MOVE',
        branding: {
          primaryColor: '#2563eb',
          secondaryColor: '#dc2626',
        },
        settings: {
          allowInstantBooking: true,
          requireDeposit: true,
          basePriceRegular: 800,
          basePriceEmergency: 1200,
          basePriceBulk: 450,
        }
      });
      console.log('✅ Default tenant created:', tenant.name);
    }

    const tenantId = tenant._id;

    // 2. Check if sample driver already exists
    const existingDriver = await usersService.findByEmail('driver@rapidmoveclear.com');
    
    let driver;
    if (existingDriver) {
      console.log('ℹ️  Sample driver already exists, skipping creation...');
    } else {
      // Create sample driver
      driver = await driversService.createDriver(
        tenantId.toString(),
        {
          firstName: 'John',
          lastName: 'Driver',
          email: 'driver@rapidmoveclear.com',
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

    // 3. Check if admin user already exists
    const existingAdmin = await usersService.findByEmail('admin@rapidmoveclear.com');
    
    if (existingAdmin) {
      console.log('ℹ️  Sample admin already exists, skipping creation...');
    } else {
      // Create sample admin user
      const admin = await usersService.create({
        tenantId,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rapidmoveclear.com',
        phone: '(555) 999-0000',
        password: 'admin123',
        role: 'admin',
      });

      console.log('✅ Admin created:', admin.email);
    }

    // 4. Check if sample bookings already exist
    const existingBookings = await bookingsService.findAll(tenantId.toString());
    
    if (existingBookings.length > 0) {
      console.log('ℹ️  Sample bookings already exist, skipping creation...');
    } else {
      // Get the driver's user ID for assignment
      const driverUser = await usersService.findByEmail('driver@rapidmoveclear.com');
      const driverUserId = driverUser.id;

      // Create sample customers and bookings
      const sampleBookings = [
        {
          tenantId,
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@example.com',
          phone: '(555) 123-4567',
          address: '1234 Oak Street',
          city: 'Downtown',
          zipCode: '12345',
          serviceType: 'emergency',
          bagCount: '1-5',
          preferredDate: new Date().toISOString().split('T')[0],
          preferredTime: 'Next 2 hours',
          specialInstructions: 'Behind garage, use side gate',
          urgentPickup: true,
          status: 'in-progress',
          driverId: driverUserId,
        },
        {
          tenantId,
          firstName: 'Mike',
          lastName: 'Chen',
          email: 'mike@example.com',
          phone: '(555) 987-6543',
          address: '5678 Pine Avenue',
          city: 'Suburbs',
          zipCode: '67890',
          serviceType: 'regular',
          bagCount: '6-10',
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          preferredTime: '10:00 AM',
          specialInstructions: 'Front curb pickup',
          urgentPickup: false,
          status: 'scheduled',
          driverId: driverUserId,
        }
      ];

      for (const bookingData of sampleBookings) {
        const booking = await bookingsService.createBooking(bookingData);
        console.log('✅ Booking created:', booking.bookingId);
      }
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data Available:');
    console.log('- Admin: admin@rapidmoveclear.com / admin123');
    console.log('- Driver: driver@rapidmoveclear.com / password123');
    console.log('- Default Tenant Slug: rapidmoveclear');
    console.log('\n🚀 You can now start the backend server!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }

  await app.close();
}

seed();
