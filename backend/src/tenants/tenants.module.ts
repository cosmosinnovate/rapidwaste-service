import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsController } from './tenants.controller';
import { TenantService } from './tenants.service';
import { Tenant, TenantSchema } from 'src/database/schemas/tenant.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema }
    ]),
    AuthModule
  ],
  controllers: [TenantsController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantsModule {}
