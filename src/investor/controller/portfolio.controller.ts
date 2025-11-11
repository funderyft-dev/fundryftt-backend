// controllers/portfolio.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio } from 'src/admin/portfolios/schema/portfolio.schema';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.portfolioService.getAllPortfolios();
  }

  @Get('featured')
  async getFeaturedPortfolios(): Promise<Portfolio[]> {
    return this.portfolioService.getFeaturedPortfolios();
  }

  @Get('search')
  async searchPortfolios(@Query('q') query: string): Promise<Portfolio[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }
    return this.portfolioService.searchPortfolios(query.trim());
  }

  @Get('status/:status')
  async getPortfoliosByStatus(
    @Param('status') status: string,
  ): Promise<Portfolio[]> {
    const validStatuses = ['active', 'inactive', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        'Invalid status. Use: active, inactive, or archived',
      );
    }
    return this.portfolioService.getPortfoliosByStatus(status);
  }

  @Get(':id')
  async getPortfolioById(@Param('id') id: string): Promise<Portfolio> {
    return this.portfolioService.getPortfolioById(id);
  }
}
