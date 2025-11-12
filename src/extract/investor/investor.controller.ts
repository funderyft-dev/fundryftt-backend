// deals/deals.controller.ts
import { Controller } from '@nestjs/common';
import { InvestorService } from './investor.service';

@Controller('main/deals')
export class InvestorController {
  constructor(private readonly investorService: InvestorService) {}
}
