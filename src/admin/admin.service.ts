import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private mailerService: MailerService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    // Check if admin with email already exists
    const existingAdmin = await this.adminModel
      .findOne({
        email: createAdminDto.email,
      })
      .exec();

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const createdAdmin = new this.adminModel(createAdminDto);
    await this.mailerService.adminCreated(
      createAdminDto.name,
      createAdminDto.email,
    );
    return createdAdmin.save();
  }

  async getAllAdmins(): Promise<Admin[]> {
    return this.adminModel.find().sort({ createdAt: -1 }).exec();
  }

  async getAdminById(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  async deleteAdmin(id: string): Promise<Admin> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id).exec();

    if (!deletedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return deletedAdmin;
  }

  async getAdminsByStatus(status: string): Promise<Admin[]> {
    return this.adminModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async getAdminsByRole(role: string): Promise<Admin[]> {
    return this.adminModel.find({ role }).sort({ createdAt: -1 }).exec();
  }

  async getAdminsStats(): Promise<any> {
    const stats = await this.adminModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const roleStats = await this.adminModel.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const verificationStats = await this.adminModel.aggregate([
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalAdmins = await this.adminModel.countDocuments();

    return {
      totalAdmins,
      statusBreakdown: stats,
      roleBreakdown: roleStats,
      verificationBreakdown: verificationStats,
    };
  }
}
