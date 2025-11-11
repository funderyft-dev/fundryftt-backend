// deals/deals.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('main/deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('companyLogo'))
  async create(
    @Body() createDealDto: CreateDealDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|svg)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    companyLogo?: Express.Multer.File,
  ) {
    try {
      return await this.dealsService.create(createDealDto, companyLogo);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}