import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor, InvestorSchema } from '../investors/schema/investor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
    ]),
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService],
  exports: [InvestorsService],
})
export class InvestorsModule {}
