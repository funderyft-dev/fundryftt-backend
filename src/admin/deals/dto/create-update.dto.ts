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
  @IsEnum(['pending', 'approved', 'rejected'])
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
  demoLink?: string;

  @IsOptional()
  @IsUrl()
  deckLink?: string;

  @IsOptional()
  @IsUrl()
  companyLogo?: string;
}
