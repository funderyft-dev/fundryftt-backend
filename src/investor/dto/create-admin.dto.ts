import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['super', 'sub'])
  role?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}