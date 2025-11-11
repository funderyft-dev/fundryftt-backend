import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Investor, InvestorSchema } from './schema/investor.schema';
import { Deal, DealSchema } from '../main/deals/schemas/deal.schema';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AdminAuthService } from './auth/auth.service';
import { AdminAuthController } from './auth/auth.controller';
import { MailerService } from 'src/mail/mail.service';
import { InvestorsModule } from './investors/investors.module';
import { JwtStrategy } from './auth/jwt.strategy'; // Add this import
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Deal.name, schema: DealSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    PassportModule, // Add PassportModule
    InvestorsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'admin-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    DealsModule,
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [
    AdminService,
    AdminAuthService,
    MailerService,
    JwtStrategy, // Add JwtStrategy here
  ],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  async onModuleInit() {
    await this.adminAuthService.createInitialAdmin();
  }
}
