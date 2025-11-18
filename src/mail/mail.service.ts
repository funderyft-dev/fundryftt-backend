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
      this.logger.error(
        `Failed to send admin creation email to ${email}`,
        error,
      );
      return false;
    }
  }

  async investorCreated(email: string, name: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryfit.com>', // Consistent domain
        to: email,
        subject: 'Welcome to Fundryft — Your Investor Account Is Ready',
        html: `
        <p>Hello <strong>${name},<strong></p>
          <p>Thank you for creating an investor account on the  <strong> Fundryft Investment Platform</strong> Your dashboard is now active and you can begin exploring investment opportunities across vetted African startups. You can start reviewing deals based on your preference.</p>
       <br/><br/>
          <p>If you have questions, our support team is available at <a href="mailto:investor@fundryft.com">investor@fundryft.com</a>.</p><br/>
          <p>Welcome aboard,<br/>
        <strong>Fundryft Investor Relations Team</strong></p>
        `,
      });
      this.logger.log(`Investor welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send investor email to ${email}`, error);
      return false;
    }
  }

  async investorSubExpired(email: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryft.com>',
        to: email,
        subject: 'Fundryft Investor Account Closed — Subscription Not Renewed',
        html: `
        <p>Hello [Investor Name],</p>
        
        <p>This is to notify you that your subscription plan has expired and your Fundryft Investor Account has been temporarily closed due to non-renewal.</p>
        
        <p>You will no longer have access to:</p>
        
        <ul>
            <li>Live deal rooms</li>
            <li>Data rooms and due diligence files</li>
            <li>Investor community and dealflow tools</li>
        </ul>
        
        <p>To reactivate your account at any time, please renew your subscription through your dashboard or contact <a href="mailto:sales@fundryft.com">sales@fundryft.com</a>.</p>
        
        <p>We hope to welcome you back soon.</p>
        
        <p>Sincerely,<br/>
        <strong>Fundryft Accounts & Billing Team</strong></p>
    `,
      });
      this.logger.log(`Investor welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send investor email to ${email}`, error);
      return false;
    }
  }

  async dealReceived(email: string, name: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryft.com>',
        to: email,
        subject: 'Fundryft — Investment Application Received',
        html: `
        <p>Hello ${name},</p>
        
        <p>Thank you for completing the investment application form on Fundryft.<br/>
        We have successfully received your submission and our review team will begin evaluating the materials provided.</p>
        
        <p>You will receive an update on the next steps within <strong>5–7 business days.</strong></p>
        
        <p>If you have any questions during the review process, please reach out to us at <a href="mailto:hello@fundryft.com">hello@fundryft.com</a>.</p>
        
        <p>Warm regards,<br/>
        <strong>Fundryft Team</strong><br/>
        Powering Startup Investment Readiness</p>
    `,
      });
      this.logger.log(`Deal received confirmation sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send deal confirmation to ${email}`, error);
      return false;
    }
  }

  async dealApproved(email: string, name: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryft.com>',
        to: email,
        subject:
          'Congratulations! Your Application Has Been Approved for Listing',
        html: `
        <p>Hello ${name},</p>
        
        <p>Great news! Your startup, <strong>${name}</strong>, has been approved to move forward to the listing stage on the Fundryft Investment Platform.</p>
        
        <p>A member of our team will contact you shortly with onboarding instructions, required documents, timeline expectations, and platform access details.</p>
        
        <p>We are excited to support your fundraising journey.</p>
        
        <p>Best regards,<br/>
        <strong>Fundryft Listings & Due Diligence Team</strong></p>
    `,
      });
      this.logger.log(`Deal received confirmation sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send deal confirmation to ${email}`, error);
      return false;
    }
  }

  async dealRejected(email: string, name: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: 'Fundryft <noreply@fundryft.com>',
        to: email,
        subject: 'Update on Your Fundryft Application',
        html: `
        <p>Hello ${name},</p>
        
        <p>Thank you for your interest in listing <strong>${name}</strong>, on the Fundryft Investment Platform. After careful review, we are unable to proceed with your application at this time.</p>
        
        <p>This decision may be due to one or more factors such as readiness level, documentation completeness, compliance requirements, or alignment with investor priorities</p>
        
        <p>We encourage you to reapply once outstanding elements have been strengthened. If you would like structured feedback, please contact <a href="mailto:hello@fundryft.com">hello@fundryft.com</a>.</p>
        
        <p>Wishing you continued success,<br/>
        <strong>Fundryft Team</strong><br/>
        /p>
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
