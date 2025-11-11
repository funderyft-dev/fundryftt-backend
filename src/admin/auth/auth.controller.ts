import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.adminAuthService.requestOtp(requestOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminAuthService.verifyOtp(verifyOtpDto);
  }
}
