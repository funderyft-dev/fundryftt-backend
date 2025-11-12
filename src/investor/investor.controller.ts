import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'; // You might want to create this

@Controller('investor')
export class InvestorController {
  constructor(private readonly investorService: InvestorService) {}

  @Get('deals')
  async getAllDeals() {
    return this.investorService.getAllDeals();
  }

  @UseGuards(JwtAuthGuard)
  @Get('deals/protected/all')
  async getAllDealsProtected() {
    return this.investorService.getAllDeals();
  }
}
