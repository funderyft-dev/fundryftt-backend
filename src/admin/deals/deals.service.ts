import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/create-update.dto';
import { Deal, DealDocument } from './schema/deal.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    private readonly mailerService: MailerService,
  ) {}

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
    // Get the current deal to check previous status and email
    const currentDeal = await this.dealModel.findById(id).exec();
    if (!currentDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    const previousStatus = currentDeal.status;
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

    // Send emails based on status changes
    await this.handleStatusChangeEmails(
      previousStatus,
      updatedDeal,
      updateDealDto,
    );

    return updatedDeal;
  }

  private async handleStatusChangeEmails(
    previousStatus: string,
    updatedDeal: DealDocument,
    updateDealDto: UpdateDealDto,
  ): Promise<void> {
    const newStatus = updatedDeal.status;

    // Only send emails if status actually changed
    if (previousStatus === newStatus) {
      return;
    }

    // Use email from DTO if provided, otherwise from the deal document
    const email = updateDealDto.email || updatedDeal.email;
    const name = updateDealDto.businessName || updatedDeal.businessName;

    if (!email || !name) {
      console.warn('Email or name not available for sending notification');
      return;
    }

    try {
      if (newStatus === 'approved') {
        await this.mailerService.dealApproved(email, name);
        console.log(`Approval email sent to ${email}`);
      } else if (newStatus === 'rejected') {
        await this.mailerService.dealRejected(email, name);
        console.log(`Rejection email sent to ${email}`);
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // Specific methods for approve/reject actions
  async approveDeal(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    // Send approval email
    if (deal.email && deal.businessName) {
      try {
        await this.mailerService.dealApproved(deal.email, deal.businessName);
        console.log(`Approval email sent to ${deal.email}`);
      } catch (error) {
        console.error('Failed to send approval email:', error);
      }
    }

    // Update deal status and handle potential null return
    const updatedDeal = await this.dealModel
      .findByIdAndUpdate(
        id,
        {
          status: 'approved',
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found after update`);
    }

    return updatedDeal;
  }

  async rejectDeal(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    // Send rejection email
    if (deal.email && deal.businessName) {
      try {
        await this.mailerService.dealRejected(deal.email, deal.businessName);
        console.log(`Rejection email sent to ${deal.email}`);
      } catch (error) {
        console.error('Failed to send rejection email:', error);
      }
    }

    // Update deal status and handle potential null return
    const updatedDeal = await this.dealModel
      .findByIdAndUpdate(
        id,
        {
          status: 'rejected',
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found after update`);
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