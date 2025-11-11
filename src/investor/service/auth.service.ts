// services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from '../schemas/investor.schema';
import { OtpService } from './otp.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(email: string): Promise<{ message: string }> {
    // Check if investor exists or create new one
    let investor = await this.investorModel.findOne({ email });

    const { otp, expires } = this.otpService.generateOtpWithExpiry();

    if (investor) {
      investor.otp = otp;
      investor.otpExpires = expires;
    } else {
      investor = new this.investorModel({
        email,
        otp,
        otpExpires: expires,
        isVerified: false,
      });
    }

    await investor.save();

    // In production, you would send this OTP via email/SMS
    console.log(`OTP for ${email}: ${otp}`); // Remove this in production

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ access_token: string }> {
    const investor = await this.investorModel.findOne({ email });

    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    if (!this.otpService.isOtpValid(investor.otpExpires)) {
      throw new BadRequestException('OTP has expired');
    }

    if (investor.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful verification
    investor.otp = '';
    investor.otpExpires = new Date();
    investor.isVerified = true;
    await investor.save();

    const payload = { email: investor.email, sub: investor._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateInvestor(payload: any): Promise<Investor> {
    const investor = await this.investorModel.findById(payload.sub);

    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    return investor;
  }
}
