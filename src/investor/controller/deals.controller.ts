// controllers/deals.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { DealsService } from '../service/deals.service';
import { Deal } from '../../admin/deals/schema/deal.schema';
import { JwtAuthGuard } from '../guard/auth.guard';

@Controller('deals')
@UseGuards(JwtAuthGuard) // All deals routes require authentication
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  async getAllDeals(): Promise<Deal[]> {
    return this.dealsService.getAllDeals();
  }

  @Get('featured')
  async getFeaturedDeals(): Promise<Deal[]> {
    return this.dealsService.getFeaturedDeals();
  }

  @Get('urgent')
  async getUrgentDeals(): Promise<Deal[]> {
    return this.dealsService.getUrgentDeals();
  }

  @Get('search')
  async searchDeals(@Query('q') query: string): Promise<Deal[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }
    return this.dealsService.searchDeals(query.trim());
  }

  @Get('industry/:industry')
  async getDealsByIndustry(
    @Param('industry') industry: string,
  ): Promise<Deal[]> {
    return this.dealsService.getDealsByIndustry(industry);
  }

  @Get('country/:country')
  async getDealsByCountry(@Param('country') country: string): Promise<Deal[]> {
    return this.dealsService.getDealsByCountry(country);
  }

  @Get('raising-range')
  async getDealsByRaisingRange(
    @Query('min', ParseIntPipe) minAmount: number,
    @Query('max', ParseIntPipe) maxAmount: number,
  ): Promise<Deal[]> {
    if (minAmount < 0 || maxAmount < 0 || minAmount > maxAmount) {
      throw new BadRequestException('Invalid amount range');
    }
    return this.dealsService.getDealsByRaisingRange(minAmount, maxAmount);
  }

  @Get('industries')
  async getIndustries(): Promise<string[]> {
    return this.dealsService.getIndustries();
  }

  @Get('countries')
  async getCountries(): Promise<string[]> {
    return this.dealsService.getCountries();
  }

  @Get(':id')
  async getDealById(@Param('id') id: string): Promise<Deal> {
    return this.dealsService.getDealById(id);
  }
}
