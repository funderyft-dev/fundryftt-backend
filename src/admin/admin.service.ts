import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from './schema/investor.schema';
import { Deal } from '../main/deals/schemas/deal.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
    @InjectModel(Deal.name) private dealModel: Model<Deal>,
  ) {}

  // Dashboard methods
  async getDashboardData() {
    const [investors, deals, stats] = await Promise.all([
      this.investorModel.find().sort({ created_at: -1 }).limit(5).exec(),
      this.dealModel.find().sort({ createdAt: -1 }).limit(5).exec(),
      this.getStats(),
    ]);

    return {
      investors,
      deals,
      stats,
    };
  }

  async getStats() {
    const [totalInvestors, activeInvestors, totalDeals, pendingDeals] =
      await Promise.all([
        this.investorModel.countDocuments().exec(),
        this.investorModel.countDocuments({ status: 'Active' }).exec(),
        this.dealModel.countDocuments().exec(),
        this.dealModel.countDocuments({ status: 'pending' }).exec(),
      ]);

    return {
      totalInvestors,
      activeInvestors,
      totalDeals,
      pendingDeals,
    };
  }

  // Deal methods
  async getAllDeals(): Promise<Deal[]> {
    return this.dealModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateDealStatus(id: string, status: string): Promise<Deal> {
    const updatedDeal = await this.dealModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    return updatedDeal;
  }
}
