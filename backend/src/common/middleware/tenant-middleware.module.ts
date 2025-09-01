import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantMiddleware } from './tenant.middleware';
import { Tenant, TenantSchema } from 'src/database/schemas/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema }
    ])
  ],
  providers: [TenantMiddleware],
  exports: [TenantMiddleware],
})
export class TenantMiddlewareModule {}
