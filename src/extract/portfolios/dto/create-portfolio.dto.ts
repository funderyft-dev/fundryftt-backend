import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsUrl()
  logoUrl: string;

  @IsString()
  summary: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'archived'])
  status?: string;
}