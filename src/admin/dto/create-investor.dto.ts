import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateInvestorDto {
  @IsEmail()
  email: string;

  @IsString()
  business: string;

  @IsString()
  niche: string;

  @IsString()
  description: string;

  @IsString()
  fund: string;

  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Pending'])
  status?: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  check_size?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
