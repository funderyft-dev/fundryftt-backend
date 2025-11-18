import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });

    // Verify connection on startup
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter verified successfully');
    } catch (error) {
      this.logger.error('Failed to verify email transporter', error);
    }
  }

  async adminSignIn(email: string, code: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft Admin <noreply@fundryfit.com>',
        to: email,
        subject: 'Verify its you!',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      });
      this.logger.log(`Verification code sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send verification code to ${email}`, error);
      return false;
    }
  }

  async adminCreated(name: string, email: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft Admin <noreply@fundryfit.com>',
        to: email,
        subject: 'Welcome as Fundryft Admin',
        html: `
          <h2>Hey ${name}!</h2>
          <p>You've been added as an administrator for Fundryft.</p>
          <p>You now have access to the admin dashboard and management features.</p>
        `,
      });
      this.logger.log(`Admin creation email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send admin creation email to ${email}`, error);
      return false;
    }
  }

  async investorCreated(email: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryfit.com>', // Consistent domain
        to: email,
        subject: 'Welcome to Fundryft Investors',
        html: `
          <h1>Welcome to Fundryft Investors!</h1>
          <p>You've been successfully added to our investor network.</p>
          <p>You now have access to exclusive investment opportunities and deals.</p>
          <br/>
          <p>We'll be in touch shortly with more information about available investments.</p>
          <p>Thanks for joining us and stay tuned for exciting opportunities!</p>
        `,
      });
      this.logger.log(`Investor welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send investor email to ${email}`, error);
      return false;
    }
  }

  async dealReceived(email: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryfit.com>', // Consistent domain
        to: email,
        subject: 'Deal Access Request Received',
        html: `
          <h1>Your Deal Access Request Has Been Received</h1>
          <p>Thank you for your interest in Fundryft deals!</p>
          <p>Our team is currently reviewing your request for investor access.</p>
          <p>We'll reach out to you as soon as the review process is complete.</p>
          <br/>
          <p>Please expect to hear from us shortly. Thank you for your patience!</p>
        `,
      });
      this.logger.log(`Deal received confirmation sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send deal confirmation to ${email}`, error);
      return false;
    }
  }
}