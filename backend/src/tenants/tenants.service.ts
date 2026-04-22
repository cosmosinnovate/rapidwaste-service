import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../database/schemas/tenant.schema';
import { CreateTenantDto, UpdateTenantDto } from '../common/dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if subdomain already exists
    const existingTenant = await this.tenantModel.findOne({
      subdomain: createTenantDto.subdomain,
    });

    if (existingTenant) {
      throw new ConflictException(`Subdomain ${createTenantDto.subdomain} already exists`);
    }

    // Set default values
    const tenantData = {
      ...createTenantDto,
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
        ...createTenantDto.branding,
      },
      pricing: {
        general: {
          basePrice: 15,
          perSignature: 15,
          urgentFee: 25,
        },
        loan_signing: {
          basePrice: 175,
          documentThreshold: 10,
          additionalFee: 25,
        },
        estate_planning: {
          basePrice: 260,
          documentThreshold: 5,
          additionalFee: 50,
        },
        ...createTenantDto.pricing,
      },
      settings: {
        allowUrgentBookings: true,
        maxDocumentsPerBooking: 20,
        maxWitnesses: 4,
        requireWitnesses: false,
        autoAssignNotaries: true,
        emailNotifications: true,
        smsNotifications: false,
        ...createTenantDto.settings,
      },
      allowedServiceTypes: ['general', 'loan_signing', 'estate_planning'],
    };

    const tenant = new this.tenantModel(tenantData);
    return tenant.save();
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findOne({ 
      subdomain: subdomain,
      isActive: true 
    }).exec();
    
    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      updateTenantDto,
      { new: true }
    ).exec();

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
  }

  async activate(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).exec();

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async deactivate(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async getTenantStats(id: string): Promise<any> {
    const tenant = await this.findOne(id);
    
    // You can add more complex statistics here
    // For now, returning basic tenant info
    return {
      id: (tenant as any).id,
      subdomain: tenant.subdomain,
      name: tenant.name,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}
