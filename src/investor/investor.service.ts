import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor, InvestorDocument } from './schema/investor.schema';
import { Deal, DealDocument } from '../admin/deals/schema/deal.schema';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>, // Add this
    private mailerService: MailerService,
  ) {}

  // Add these methods to fetch deals
  async getAllDeals(): Promise<Deal[]> {
    return this.dealModel
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getDealById(id: string): Promise<Deal> {
    const deal = await this.dealModel
      .findOne({
        _id: id,
        status: 'approved',
      })
      .exec();

    if (!deal) {
      throw new NotFoundException(
        `Deal with ID ${id} not found or not approved`,
      );
    }
    return deal;
  }

  async getDealsByIndustry(industry: string): Promise<Deal[]> {
    return this.dealModel
      .find({
        status: 'approved',
        industry: new RegExp(industry, 'i'),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedDeals(): Promise<Deal[]> {
    return this.dealModel
      .find({
        status: 'approved',
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }
}
