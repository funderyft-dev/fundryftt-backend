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
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('main/deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('companyLogo', {
      storage: diskStorage({
        destination: './uploads/company-logos',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `company-logo-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow common image types including PNG
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/svg+xml',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              `File type ${file.mimetype} is not allowed. Only images are permitted.`,
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async create(
    @Body() createDealDto: CreateDealDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // Remove FileTypeValidator - rely on the fileFilter above
        ],
        fileIsRequired: false,
      }),
    )
    companyLogo?: Express.Multer.File,
  ) {
    try {
      const logoPath = companyLogo ? companyLogo.path : undefined;
      return await this.dealsService.create(createDealDto, logoPath);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
