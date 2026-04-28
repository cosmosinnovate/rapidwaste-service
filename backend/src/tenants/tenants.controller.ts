import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new moving company (SaaS Tenant)' })
  async register(@Body() registerTenantDto: RegisterTenantDto) {
    const result = await this.tenantsService.register(registerTenantDto);
    return {
      success: true,
      message: 'Company registered successfully. You can now log in to your dashboard.',
      data: result,
    };
  }

  @Public()
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    const tenant = await this.tenantsService.findBySlug(slug);
    return {
      success: true,
      data: tenant,
    };
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: any) {
    const tenant = await this.tenantsService.update(id, updateTenantDto);
    return {
      success: true,
      data: tenant,
    };
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const tenant = await this.tenantsService.findById(id);
    return {
      success: true,
      data: tenant,
    };
  }
}
