import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { MailerService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [AdminAuthService, MailerService],
  controllers: [AdminAuthController],
})
export class AuthModule {}
