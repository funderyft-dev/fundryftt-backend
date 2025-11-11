import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AdminGuard } from './common/guards/admin.guards';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard routes
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardData();
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // Deal routes (for managing deals from main website)
  @Get('deals')
  getDeals() {
    return this.adminService.getAllDeals();
  }

  @Put('deals/:id/status')
  updateDealStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateDealStatus(id, status);
  }
}
