import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotaryModule } from './notary/notary.module';
import { TenantsModule } from './tenants/tenants.module';
import { BookingsGateway } from './gateways/bookings.gateway';
import { TenantMiddlewareModule } from './common/middleware/tenant-middleware.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { Tenant, TenantSchema } from './database/schemas/tenant.schema';

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
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema }
    ]),
    AuthModule,
    UsersModule,
    BookingsModule,
    NotaryModule,
    TenantsModule,
    TenantMiddlewareModule,
  ],
  providers: [BookingsGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
} 