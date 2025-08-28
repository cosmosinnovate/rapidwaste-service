import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotaryService } from './notary.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('notary')
@Controller('notary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotaryController {
  constructor(private readonly notaryService: NotaryService) {}

  @Get(':id/dashboard')
  @Roles('notary', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notary dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Notary not found' })
  async getNotaryDashboard(@Param('id') id: string) {
    const dashboard = await this.notaryService.getNotaryDashboard(id);
    return {
      success: true,
      data: dashboard,
    };
  }

  @Get(':id/bookings')
  @Roles('notary', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notary bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Notary not found' })
  async getNotaryBookings(
    @Param('id') id: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const bookings = await this.notaryService.getNotaryBookings(id, status, date);
    return {
      success: true,
      data: bookings,
    };
  }

  @Get('available')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available notaries' })
  @ApiResponse({ status: 200, description: 'Available notaries retrieved successfully' })
  async getAvailableNotaries() {
    const notaries = await this.notaryService.getAvailableNotaries();
    return {
      success: true,
      data: notaries,
    };
  }
}
