import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor, InvestorDocument } from './schema/investor.schema';
import { CreateInvestorDto } from './dto/create-investor.dto';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
  ) {}

  async create(createInvestorDto: CreateInvestorDto): Promise<Investor> {
    // Check if investor with email already exists
    const existingInvestor = await this.investorModel.findOne({
      email: createInvestorDto.email,
    });

    if (existingInvestor) {
      throw new ConflictException('Investor with this email already exists');
    }

    const createdInvestor = new this.investorModel(createInvestorDto);
    return await createdInvestor.save();
  }

  async findAll(): Promise<Investor[]> {
    return this.investorModel.find().sort({ created_at: -1 }).exec();
  }

  async findOne(id: string): Promise<Investor> {
    const investor = await this.investorModel.findById(id).exec();
    if (!investor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }
    return investor;
  }

  async update(
    id: string,
    updateInvestorDto: Partial<CreateInvestorDto>,
  ): Promise<Investor> {
    const updatedInvestor = await this.investorModel
      .findByIdAndUpdate(id, updateInvestorDto, { new: true })
      .exec();

    if (!updatedInvestor) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }

    return updatedInvestor;
  }

  async remove(id: string): Promise<void> {
    const result = await this.investorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Investor with ID ${id} not found`);
    }
  }

  async findByStatus(status: string): Promise<Investor[]> {
    return this.investorModel.find({ status }).sort({ created_at: -1 }).exec();
  }
}
