import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from '../../database/schemas/tenant.schema';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const subdomain = this.extractSubdomain(host);
    
    if (subdomain && subdomain !== 'www' && subdomain !== 'admin') {
      try {
        // Find tenant by subdomain
        const tenant = await this.tenantModel.findOne({ 
          subdomain: subdomain,
          isActive: true 
        }).exec();

        if (!tenant) {
          throw new NotFoundException(`Tenant not found: ${subdomain}`);
        }

        // Inject tenant context into request
        req['tenant'] = tenant;
        req['tenantId'] = tenant._id;
        req['subdomain'] = subdomain;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new NotFoundException(`Invalid tenant: ${subdomain}`);
      }
    } else if (subdomain === 'admin') {
      // Admin subdomain - no tenant context needed
      req['isAdmin'] = true;
    } else {
      // Main domain - no tenant context
      req['isMainDomain'] = true;
    }

    next();
  }

  private extractSubdomain(host: string): string | null {
    // Handle localhost for development
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      const parts = host.split(':')[0].split('.');
      return parts.length > 1 ? parts[0] : null;
    }

    // Handle production domains
    const parts = host.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    
    return null;
  }
}
