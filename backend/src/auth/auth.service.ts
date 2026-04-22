import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { UserDocument } from '../database/schemas/user.schema';
import { Tenant, TenantDocument } from '../database/schemas/tenant.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  // Normalize business-friendly titles to internal system roles
  private normalizeIncomingRole(input: string): 'customer' | 'notary' {
    if (!input) return 'customer';
    const val = String(input).toLowerCase().trim();
    const businessOwnerAliases = new Set([
      'notary',
      'ceo',
      'business owner',
      'owner',
      'founder',
      'operations manager',
      'office manager',
      'manager',
      'executive',
      'director',
      'partner',
      'principal',
    ]);
    return businessOwnerAliases.has(val) ? 'notary' : 'customer';
  }

  private generateTokens(user: UserDocument) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Shorter access token
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Longer refresh token

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        driverId: user.driverId,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Normalize incoming business-friendly titles to allowed schema roles
    const normalizedRole = this.normalizeIncomingRole((registerDto as any).role);
    const user = await this.usersService.create({
      ...registerDto,
      role: normalizedRole,
    });

    // If the user registered as a notary, automatically create a default tenant
    if (normalizedRole === 'notary') {
      // Build a unique subdomain: firstname-lastname or email local part
      const base = (registerDto.firstName && registerDto.lastName)
        ? `${registerDto.firstName}${registerDto.lastName}`
        : registerDto.email.split('@')[0];
      const normalizedBase = base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      let subdomain = normalizedBase || 'notary';
      let attempt = 0;
      // Ensure unique subdomain
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existing = await this.tenantModel.findOne({ subdomain }).lean();
        if (!existing) break;
        attempt += 1;
        subdomain = `${normalizedBase}-${attempt}`;
      }

      const tenantName = registerDto.firstName && registerDto.lastName
        ? `${registerDto.firstName} ${registerDto.lastName} Notary Services`
        : `${subdomain} Notary Services`;

      const defaultTenant = new this.tenantModel({
        subdomain,
        name: tenantName,
        email: registerDto.email,
        phone: registerDto.phone,
        isActive: true,
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          fontFamily: 'Inter',
        },
        pricing: {
          general: { basePrice: 15, perSignature: 15, urgentFee: 25 },
          loan_signing: { basePrice: 175, documentThreshold: 10, additionalFee: 25 },
          estate_planning: { basePrice: 260, documentThreshold: 5, additionalFee: 50 },
        },
        settings: {
          allowUrgentBookings: true,
          maxDocumentsPerBooking: 20,
          maxWitnesses: 4,
          requireWitnesses: false,
          autoAssignNotaries: true,
          emailNotifications: true,
          smsNotifications: false,
        },
        allowedServiceTypes: ['general', 'loan_signing', 'estate_planning'],
        notaryIds: [user.id],
      });

      await defaultTenant.save();

      // Promote the registering notary to admin to manage their tenant
      await this.usersService.updateUserRole(user.id, 'admin');
      // Reflect updated role in token response
      user.role = 'admin' as any;
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 