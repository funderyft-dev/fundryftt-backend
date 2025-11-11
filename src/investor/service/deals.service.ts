// services/deals.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from "../../admin/deals/schema/deal.schema"

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
  ) {}

  async getAllDeals(): Promise<Deal[]> {
    return this.dealModel
      .find({ status: 'approved' }) // Only show approved deals to investors
      .select('-email') // Exclude email for privacy
      .sort({ createdAt: -1 })
      .exec();
  }

  async getDealById(id: string): Promise<Deal> {
    const deal = await this.dealModel
      .findOne({ 
        _id: id, 
        status: 'approved' 
      })
      .select('-email') // Exclude email for privacy
      .exec();
    
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found or not approved`);
    }
    
    return deal;
  }

  async getDealsByIndustry(industry: string): Promise<Deal[]> {
    return this.dealModel
      .find({ 
        status: 'approved',
        industry: { $regex: industry, $options: 'i' }
      })
      .select('-email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getDealsByCountry(country: string): Promise<Deal[]> {
    return this.dealModel
      .find({ 
        status: 'approved',
        country: { $regex: country, $options: 'i' }
      })
      .select('-email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchDeals(query: string): Promise<Deal[]> {
    return this.dealModel
      .find({
        status: 'approved',
        $or: [
          { businessName: { $regex: query, $options: 'i' } },
          { industry: { $regex: query, $options: 'i' } },
          { problem: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .select('-email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedDeals(): Promise<Deal[]> {
    // Get deals that are approved and have the highest raising amounts
    return this.dealModel
      .find({ status: 'approved' })
      .select('-email')
      .sort({ raisingAmount: -1, createdAt: -1 })
      .limit(8) // Limit to 8 featured deals
      .exec();
  }

  async getDealsByRaisingRange(minAmount: number, maxAmount: number): Promise<Deal[]> {
    return this.dealModel
      .find({
        status: 'approved',
        raisingAmount: { $gte: minAmount, $lte: maxAmount }
      })
      .select('-email')
      .sort({ raisingAmount: -1 })
      .exec();
  }

  async getIndustries(): Promise<string[]> {
    const industries = await this.dealModel
      .distinct('industry', { status: 'approved' })
      .exec();
    
    return industries.filter(industry => industry !== null && industry !== '');
  }

  async getCountries(): Promise<string[]> {
    const countries = await this.dealModel
      .distinct('country', { status: 'approved' })
      .exec();
    
    return countries.filter(country => country !== null && country !== '');
  }

  // Optional: Get deals with active funding deadlines
  async getUrgentDeals(): Promise<Deal[]> {
    const now = new Date();
    return this.dealModel
      .find({
        status: 'approved',
        deadline: { $gte: now }
      })
      .select('-email')
      .sort({ deadline: 1 }) // Sort by closest deadline first
      .limit(5)
      .exec();
  }
}