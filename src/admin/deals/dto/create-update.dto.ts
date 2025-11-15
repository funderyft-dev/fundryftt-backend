import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  Min,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDealDto {
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'completed'])
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fundTarget?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deadline?: Date;

  @IsOptional()
  @IsUrl()
  dealDocument?: string;

  // NEW FIELDS
  @IsOptional()
  @IsEnum(['seed', 'pre-seed', 'series A', 'series B', 'series C', 'other'])
  round?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalRoundRaise?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  allocation?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  capitalCall?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valuation?: number;

  @IsOptional()
  @IsUrl()
  financialModel?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  businessName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  industry?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  problem?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  whyNow?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  advantage?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  revenueModel?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  raisingAmount?: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @IsOptional()
  @IsUrl()
  deckLink?: string;

  @IsOptional()
  @IsUrl()
  companyLogo?: string;
}
