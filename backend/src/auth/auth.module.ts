import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { Tenant, TenantSchema } from '../database/schemas/tenant.schema';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'notary_now-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {} 