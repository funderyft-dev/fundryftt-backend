// services/portfolio.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from 'src/admin/portfolios/schema/portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
  ) {}

  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({ status: 'active' }) // Only get active portfolios
      .sort({ createdAt: -1 }) // Sort by latest first
      .exec();
  }

  async getPortfolioById(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findOne({ 
      _id: id, 
      status: 'active' 
    }).exec();
    
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    
    return portfolio;
  }

  async getPortfoliosByStatus(status: string): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({ status })
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchPortfolios(query: string): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({
        status: 'active',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedPortfolios(): Promise<Portfolio[]> {
    // You can add a 'isFeatured' field to the schema if needed
    // For now, we'll just get the latest active portfolios
    return this.portfolioModel
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(6) // Limit to 6 featured portfolios
      .exec();
  }
}