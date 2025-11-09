import {
  IsString,
  IsEmail,
  IsNumber,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDto {
  @IsEmail()
  email: string;

  @IsString()
  businessName: string;

  @IsString()
  industry: string;

  @IsString()
  problem: string;

  @IsString()
  whyNow: string;

  @IsString()
  advantage: string;

  @IsString()
  revenueModel: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  raisingAmount: number;

  @IsInt()
  @Min(1900)
  @Type(() => Number)
  yearFounded: number;

  @IsString()
  country: string;

  @IsUrl()
  demoLink?: string;

  @IsUrl()
  deckLink?: string;

  @IsString()
  description: string;
}
