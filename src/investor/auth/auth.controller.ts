import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { InvestorAuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('investor/auth') // This creates /investor/auth routes
export class InvestorAuthController {
  constructor(private readonly investorAuthService: InvestorAuthService) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.investorAuthService.requestOtp(requestOtpDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.investorAuthService.verifyOtp(verifyOtpDto);
  }
}