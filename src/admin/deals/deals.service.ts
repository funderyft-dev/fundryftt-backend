import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/create-update.dto';
import { Deal, DealDocument } from './schema/deal.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DealsService {
  constructor(@InjectModel(Deal.name) private dealModel: Model<DealDocument>) {}

  // Public method - users can create deals
  async createDeal(createDealDto: CreateDealDto): Promise<Deal> {
    const createdDeal = new this.dealModel(createDealDto);
    return createdDeal.save();
  }

  // Admin methods - only admins can access these

  async getAllDeals(): Promise<Deal[]> {
    return this.dealModel.find().sort({ createdAt: -1 }).exec();
  }

  async getDealsByStatus(status: string): Promise<Deal[]> {
    return this.dealModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async getDealById(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return deal;
  }

  async updateDeal(id: string, updateDealDto: UpdateDealDto): Promise<Deal> {
    const updatedDeal = await this.dealModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDealDto,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return updatedDeal;
  }

  async deleteDeal(id: string): Promise<Deal> {
    const deletedDeal = await this.dealModel.findByIdAndDelete(id).exec();
    if (!deletedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return deletedDeal;
  }

  async getDealsStats(): Promise<any> {
    const stats = await this.dealModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRaisingAmount: { $sum: '$raisingAmount' },
        },
      },
    ]);

    const totalDeals = await this.dealModel.countDocuments();

    return {
      totalDeals,
      statusBreakdown: stats,
    };
  }
}
