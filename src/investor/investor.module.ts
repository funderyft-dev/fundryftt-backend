import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerService } from 'src/mail/mail.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { InvestorAuthService } from './auth/auth.service';
import { InvestorAuthController } from './auth/auth.controller';
import { InvestorController } from './investor.controller'; // Add this
import { InvestorService } from './investor.service'; // Add this
import { Investor, InvestorSchema } from './schema/investor.schema';
import { Deal, DealSchema } from '../admin/deals/schema/deal.schema'; // Add this

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Deal.name, schema: DealSchema }, // Add this
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'investor-secret-key',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [InvestorAuthController, InvestorController], // Add InvestorController
  providers: [
    MailerService,
    InvestorAuthService,
    JwtStrategy,
    InvestorService, // Add this
  ],
})
export class InvestorModule {}
