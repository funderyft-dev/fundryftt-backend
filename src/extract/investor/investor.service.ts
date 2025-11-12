// deals/deals.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/investor.schema';
import { MailerService } from 'src/mail/mail.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    private mailerService: MailerService,
    private cloudinaryService: CloudinaryService,
  ) {}


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
