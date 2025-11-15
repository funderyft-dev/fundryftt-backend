import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsNumber, 
  IsUrl, 
  Min, 
  IsInt,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateDealDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  businessName: string;

  @IsString()
  @MinLength(2)
  industry: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  problem: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  whyNow: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  advantage: string;

  @IsString()
  @MinLength(5)
  revenueModel: string;

  @IsNumber()
  @Min(0)
  raisingAmount: number;

  @IsInt()
  @Min(1900)
  yearFounded: number;

  @IsString()
  country: string;

  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @IsOptional()
  @IsUrl()
  deckLink?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsUrl()
  companyLogo?: string;
}