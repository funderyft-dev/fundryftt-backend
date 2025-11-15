import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from '../schema/investor.schema';
import { JwtService } from '@nestjs/jwt';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class InvestorAuthService {
  private readonly logger = new Logger(InvestorAuthService.name);

  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  // Generate random OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    const { email } = requestOtpDto;

    // Check if investor exists
    const investor = await this.investorModel.findOne({ email });

    if (!investor) {
      throw new BadRequestException('Investor not found');
    }

    // Check if investor is active
    if (investor.status !== 'Active') {
      throw new BadRequestException('Investor account is not active');
    }

    // Generate OTP
    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update investor with OTP
    investor.otp = otp;
    investor.otpExpires = otpExpires;
    investor.otpAttempts = 0;
    investor.lastOtpSent = new Date();

    await investor.save();

    // Send OTP via email
    try {
      await this.mailerService.adminSignIn(email, otp);
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error.stack);
      throw new BadRequestException('Failed to send OTP email');
    }

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    access_token: string;
    email: string;
  }> {
    const { email, otp } = verifyOtpDto;

    const investor = await this.investorModel.findOne({ email });

    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Check OTP attempts
    if (investor.otpAttempts >= 5) {
      throw new BadRequestException(
        'Too many OTP attempts. Please request a new OTP.',
      );
    }

    // Check if OTP is expired
    if (!investor.otpExpires || investor.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Check if OTP exists
    if (!investor.otp) {
      throw new BadRequestException('No OTP requested for this email');
    }

    // Verify OTP
    if (investor.otp !== otp) {
      investor.otpAttempts += 1;
      await investor.save();
      throw new UnauthorizedException('Invalid OTP');
    }

    // OTP is valid - clear OTP data and mark as verified
    investor.otp = '';
    investor.otpExpires = new Date(Date.now());
    investor.otpAttempts = 0;
    investor.isVerified = true;
    await investor.save();

    // Generate JWT token
    const payload = {
      email: investor.email,
      sub: investor._id.toString(),
      role: 'investor', // Fixed role
      name: investor.name,
    };

    const access_token = this.jwtService.sign(payload);

    return { email: investor.email, access_token };
  }
}
