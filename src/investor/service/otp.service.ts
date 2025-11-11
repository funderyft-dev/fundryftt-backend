// services/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  generateOtp(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  generateOtpWithExpiry(minutes: number = 10): { otp: string; expires: Date } {
    const otp = this.generateOtp();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + minutes);
    
    return { otp, expires };
  }

  isOtpValid(otpExpires: Date): boolean {
    return new Date() < otpExpires;
  }
}