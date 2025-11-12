import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor, InvestorSchema } from '../investors/schema/investor.schema';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
    ]),
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService, MailerService],
  exports: [InvestorsService],
})
export class InvestorsModule {}
