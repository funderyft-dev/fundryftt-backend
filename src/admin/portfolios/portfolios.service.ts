import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schema/portfolio.schema';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
  ) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const createdPortfolio = new this.portfolioModel(createPortfolioDto);
    return createdPortfolio.save();
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.portfolioModel.find().sort({ createdAt: -1 }).exec();
  }

  async getPortfoliosByStatus(status: string): Promise<Portfolio[]> {
    return this.portfolioModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async getPortfolioById(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findById(id).exec();
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async updatePortfolio(id: string, updatePortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const updatedPortfolio = await this.portfolioModel
      .findByIdAndUpdate(
        id,
        { 
          ...updatePortfolioDto,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec();

    if (!updatedPortfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return updatedPortfolio;
  }

  async deletePortfolio(id: string): Promise<Portfolio> {
    const deletedPortfolio = await this.portfolioModel.findByIdAndDelete(id).exec();
    if (!deletedPortfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return deletedPortfolio;
  }

  async getPortfoliosStats(): Promise<any> {
    const stats = await this.portfolioModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalPortfolios = await this.portfolioModel.countDocuments();
    
    return {
      totalPortfolios,
      statusBreakdown: stats
    };
  }
}