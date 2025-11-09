import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/deal.schema';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
  constructor(@InjectModel(Deal.name) private dealModel: Model<DealDocument>) {}

  async create(
    createDealDto: CreateDealDto,
    companyLogo?: string,
  ): Promise<Deal> {
    try {
      const dealData = {
        ...createDealDto,
        ...(companyLogo && { companyLogo }),
      };

      const createdDeal = new this.dealModel(dealData);
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

  // Alternative approach if you want to allow null returns:
  // async findOne(id: string): Promise<Deal | null> {
  //   return this.dealModel.findById(id).exec();
  // }
}
