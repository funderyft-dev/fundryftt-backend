import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AdminGuard } from './common/guards/admin.guards';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  getAdmins(@Query('status') status?: string, @Query('role') role?: string) {
    if (status) {
      return this.adminService.getAdminsByStatus(status);
    }
    if (role) {
      return this.adminService.getAdminsByRole(role);
    }
    return this.adminService.getAllAdmins();
  }

  @Get('stats')
  getAdminsStats() {
    return this.adminService.getAdminsStats();
  }



  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
