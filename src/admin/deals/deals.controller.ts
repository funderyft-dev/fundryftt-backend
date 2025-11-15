import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../../admin/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guards';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/create-update.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Public route - users can create deals without auth
  @Post()
  createDeal(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.createDeal(createDealDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getDeals(@Query('status') status?: string) {
    if (status) {
      return this.dealsService.getDealsByStatus(status);
    }
    return this.dealsService.getAllDeals();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  getDealsStats() {
    return this.dealsService.getDealsStats();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  getDeal(@Param('id') id: string) {
    return this.dealsService.getDealById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  updateDeal(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.updateDeal(id, updateDealDto);
  }

  // ADD PDF UPLOAD ENDPOINT
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/upload-document')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDealDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check if file is PDF
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException(
        'File size too large. Maximum 10MB allowed.',
      );
    }

    try {
      // Upload to Cloudinary
      const documentUrl = await this.cloudinaryService.uploadDocument(file);

      // Update deal with document URL
      const updateDealDto: UpdateDealDto = { dealDocument: documentUrl };
      return this.dealsService.updateDeal(id, updateDealDto);
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload document: ${error.message}`,
      );
    }
  }

  // ADD DOCUMENT DELETE ENDPOINT
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id/document')
  async deleteDealDocument(@Param('id') id: string) {
    const deal = await this.dealsService.getDealById(id);

    if (!deal.dealDocument) {
      throw new BadRequestException('No document found for this deal');
    }

    try {
      // Extract public ID and delete from Cloudinary
      const publicId = this.cloudinaryService.extractPublicId(
        deal.dealDocument,
      );
      await this.cloudinaryService.deleteDocument(publicId);

      // Remove document URL from deal
      const updateDealDto: UpdateDealDto = { dealDocument: undefined };
      return this.dealsService.updateDeal(id, updateDealDto);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete document: ${error.message}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deleteDeal(@Param('id') id: string) {
    return this.dealsService.deleteDeal(id);
  }
}
