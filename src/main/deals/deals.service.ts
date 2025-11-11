// deals/deals.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/deal.schema';
import { CreateDealDto } from './dto/create-deal.dto';
import { MailerService } from 'src/mail/mail.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'; 

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    private mailerService: MailerService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createDealDto: CreateDealDto,
    companyLogo?: Express.Multer.File,
  ): Promise<Deal> {
    try {
      let companyLogoUrl: string | undefined;

      // Upload to Cloudinary if logo exists
      if (companyLogo) {
        companyLogoUrl = await this.cloudinaryService.uploadImage(companyLogo);
      }

      const dealData = {
        ...createDealDto,
        ...(companyLogoUrl && { companyLogo: companyLogoUrl }),
      };

      const createdDeal = new this.dealModel(dealData);
      await this.mailerService.dealRecieved(createDealDto.email);
      return await createdDeal.save();
    } catch (error) {
      throw new BadRequestException('Error creating deal: ' + error.message);
    }
  }

  async findAll(): Promise<Deal[]> {
    return this.dealModel.find().exec();
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return deal;
  }
}