import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUrl()
  linkedIn?: string;

  @IsString()
  date: string;

  @IsString()
  editor: string;

  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  metaTag?: string;

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: string;
}