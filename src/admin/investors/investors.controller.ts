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
import { InvestorsService } from './investors.service';
import { JwtAuthGuard } from '../../admin/auth/guards/jwt-auth.guard'; // Fixed import path
import { AdminGuard } from '../common/guards/admin.guards';
import { CreateInvestorDto } from './dto/create-investor.dto';

@Controller('investors')
@UseGuards(JwtAuthGuard, AdminGuard)
export class InvestorsController {
  constructor(private readonly investorsService: InvestorsService) {}

  @Post()
  createInvestor(@Body() createInvestorDto: CreateInvestorDto) {
    return this.investorsService.createInvestor(createInvestorDto);
  }

  @Get()
  getInvestors(@Query('status') status?: string) {
    if (status) {
      return this.investorsService.getInvestorsByStatus(status);
    }
    return this.investorsService.getAllInvestors();
  }

  @Get(':id')
  getInvestor(@Param('id') id: string) {
    return this.investorsService.getInvestorById(id);
  }

  @Put(':id')
  updateInvestor(
    @Param('id') id: string,
    @Body() updateInvestorDto: Partial<CreateInvestorDto>,
  ) {
    return this.investorsService.updateInvestor(id, updateInvestorDto);
  }

  @Delete(':id')
  deleteInvestor(@Param('id') id: string) {
    return this.investorsService.deleteInvestor(id);
  }
}
