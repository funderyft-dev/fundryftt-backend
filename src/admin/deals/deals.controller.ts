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
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../../admin/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guards';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/create-update.dto';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  // Public route - users can create deals without auth
  @Post()
  createDeal(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.createDeal(createDealDto);
  }

  // ADMIN PROTECTED ROUTES - All routes below require admin authentication

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getDeals(@Query('status') status?: string) {
    if (status) {
      return this.dealsService.getDealsByStatus(status);
    }
    return this.dealsService.getAllDeals();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  getDealsStats() {
    return this.dealsService.getDealsStats();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  getDeal(@Param('id') id: string) {
    return this.dealsService.getDealById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  updateDeal(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.updateDeal(id, updateDealDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteDeal(@Param('id') id: string) {
    return this.dealsService.deleteDeal(id);
  }
}