import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { InvestorAuthService } from './auth.service';
import { InvestorAuthController } from './auth.controller';
import { MailerService } from 'src/mail/mail.service';
import { Investor, InvestorSchema } from '../schema/investor.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Investor.name, schema: InvestorSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'investor-secret-key',
      signOptions: { expiresIn: '24h' }, // Added expiration
    }),
  ],
  providers: [InvestorAuthService, MailerService, JwtStrategy],
  controllers: [InvestorAuthController],
})
export class AuthModule {}