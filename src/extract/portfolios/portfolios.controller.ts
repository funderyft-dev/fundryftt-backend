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
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Controller('/extract/portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfoliosService.createPortfolio(createPortfolioDto);
  }

  @Get()
  getPortfolios(@Query('status') status?: string) {
    if (status) {
      return this.portfoliosService.getPortfoliosByStatus(status);
    }
    return this.portfoliosService.getAllPortfolios();
  }

  @Get('stats')
  getPortfoliosStats() {
    return this.portfoliosService.getPortfoliosStats();
  }

  @Get(':id')
  getPortfolio(@Param('id') id: string) {
    return this.portfoliosService.getPortfolioById(id);
  }

  @Put(':id')
  updatePortfolio(
    @Param('id') id: string,
    @Body() updatePortfolioDto: CreatePortfolioDto,
  ) {
    return this.portfoliosService.updatePortfolio(id, updatePortfolioDto);
  }

  @Delete(':id')
  deletePortfolio(@Param('id') id: string) {
    return this.portfoliosService.deletePortfolio(id);
  }
}