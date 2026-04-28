import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from '../common/dto/auth.dto';
import { UserDocument } from '../database/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateTokens(user: UserDocument) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      tenantId: user.tenantId,
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
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        driverId: user.driverId,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Find user scoped by tenant
    const user = await this.usersService.findByEmailAndTenant(
      loginDto.email,
      loginDto.tenantId,
    );

    // 2. Validate user existence and password
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password for this portal');
    }

    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create(registerDto as any);
    
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