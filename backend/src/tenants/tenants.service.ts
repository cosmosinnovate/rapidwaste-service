import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from '../database/schemas/tenant.schema';
import { UsersService } from '../users/users.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async register(dto: RegisterTenantDto): Promise<{ tenant: TenantDocument; admin: any }> {
    // 1. Check if slug exists
    const existing = await this.tenantModel.findOne({ slug: dto.slug });
    if (existing) {
      throw new ConflictException('A company with this URL slug already exists');
    }

    // 2. Create the tenant
    const tenant = new this.tenantModel({
      name: dto.companyName,
      slug: dto.slug,
      contactEmail: dto.contactEmail,
      phone: dto.phone,
      settings: {
        allowInstantBooking: true,
        requireDeposit: true,
        basePriceRegular: 800,
        basePriceEmergency: 1200,
        basePriceBulk: 450,
      }
    });

    const savedTenant = await tenant.save();

    // 3. Create the initial admin user for this tenant
    try {
      const admin = await this.usersService.create({
        tenantId: savedTenant._id as any,
        firstName: dto.adminFirstName,
        lastName: dto.adminLastName,
        email: dto.contactEmail,
        phone: dto.phone || 'N/A', // Use company phone or default
        password: dto.password,
        role: 'admin',
      });

      return { tenant: savedTenant, admin };
    } catch (error) {
      // Rollback tenant creation if user creation fails
      await this.tenantModel.findByIdAndDelete(savedTenant._id);
      throw error;
    }
  }

  async create(createTenantDto: any): Promise<TenantDocument> {
    const existing = await this.tenantModel.findOne({ slug: createTenantDto.slug });
    if (existing) {
      throw new ConflictException('Tenant with this slug already exists');
    }
    const tenant = new this.tenantModel(createTenantDto);
    return tenant.save();
  }

  async findAll(): Promise<TenantDocument[]> {
    return this.tenantModel.find().exec();
  }

  async findById(id: string): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findBySlug(slug: string): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findOne({ slug }).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with slug ${slug} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: any): Promise<TenantDocument> {
    const tenant = await this.tenantModel
      .findByIdAndUpdate(id, updateTenantDto, { new: true })
      .exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }
}
