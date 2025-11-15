import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerService } from 'src/mail/mail.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { InvestorAuthService } from './auth/auth.service';
import { InvestorAuthController } from './auth/auth.controller';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';

import { Review } from './review/schema/review.schema';
import { ReviewModule } from './review/review.module'; // Add this import
import { Investor, InvestorSchema } from './schema/investor.schema';
import { Deal, DealSchema } from '../admin/deals/schema/deal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Deal.name, schema: DealSchema },
      // Remove Review from here since it's now in ReviewModule
    ]),
    ReviewModule, // Add this line to import the ReviewModule
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'investor-secret-key',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [InvestorAuthController, InvestorController],
  providers: [
    MailerService,
    InvestorAuthService,
    JwtStrategy,
    InvestorService,
    // Remove ReviewService from here since it's now in ReviewModule
  ],
})
export class InvestorModule {}
