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

  async dealRecieved(email: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Fundryft Admin <noreply@yourapp.com>',
      to: email,
      subject: 'Added to the access waitlist',
      html: `
        <h1>Fundryft Successfully recieved your request</h1>
        <p>Hi!!! we recieved your request to have access to investors, please note that our team are reviewing your request as we speak and you'd be reached out to as soon as possible </p>
       <Br/>
        <p>Please keep your head up as you'd hear from us shortly. Thanks and stay in touch</p>
      `,
    });
  }
}
