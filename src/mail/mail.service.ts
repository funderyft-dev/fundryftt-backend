import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      // host: 'Gmail', // Replace with your SMTP host (e.g., Gmail)
      // port: 587,
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'), //ramz psal zrmd pkbf
      },
    });
  }

  async adminSignIn(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Fundryft Admin <noreply@fundryfit.com>',
      to: email,
      subject: 'Verify its you!',
      html: ` <p>Your verification code is: <strong>${code}</strong></p>`,
    });
  }

  async sendResetCodeEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Your App <noreply@yourapp.com>',
      to: email,
      subject: 'Your Password Reset Code',
      html: `
        <h1>Password Reset Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
