import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../schema/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  // Generate random OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Simulate email service
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    console.log(`OTP for ${email}: ${otp}`);
    await this.mailerService.adminSignIn(email, otp);
  }

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    const { email } = requestOtpDto;
    console.log(email);

    // Check if admin exists
    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      // Throw BadRequestException when admin doesn't exist
      throw new BadRequestException('Admin does not exist');
    }

    // Generate OTP
    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update admin with OTP
    admin.otp = otp;
    admin.otpExpires = otpExpires;
    admin.otpAttempts = 0;
    admin.lastOtpSent = new Date();

    await admin.save();

    // Send OTP via email
    await this.sendOtpEmail(email, otp);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ access_token: string }> {
    const { email, otp } = verifyOtpDto;

    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // Check OTP attempts
    if (admin.otpAttempts >= 5) {
      throw new BadRequestException(
        'Too many OTP attempts. Please request a new OTP.',
      );
    }

    // Check if OTP is expired
    if (!admin.otpExpires || admin.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Verify OTP
    if (admin.otp !== otp) {
      admin.otpAttempts += 1;
      await admin.save();
      throw new UnauthorizedException('Invalid OTP');
    }

    // OTP is valid - clear OTP data and mark as verified
    admin.otp = null;
    admin.otpExpires = null;
    admin.otpAttempts = 0;
    admin.isVerified = true;
    await admin.save();

    // Generate JWT token
    const payload = {
      email: admin.email,
      sub: admin._id,
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // // Method to create initial admin for testing
  async createInitialAdmin(): Promise<void> {
    const adminEmail = 'example@gmail.com';

    console.log('Initial admin user created:', adminEmail);
    // }
  }
}
