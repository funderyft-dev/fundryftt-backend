// deals/deals.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';

@Module({
  imports: [MongooseModule.forFeature()],
  controllers: [InvestorController],
  providers: [InvestorService],
})
export class DealsModule {}
