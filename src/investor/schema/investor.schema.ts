import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  business: string;

  @Prop({ required: true })
  niche: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fund: string;

  @Prop({ default: 'Active', enum: ['Active', 'Inactive', 'Pending'] })
  status: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  country: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpires: Date;

  @Prop({ default: 0 })
  otpAttempts: number;

  @Prop()
  lastOtpSent: Date;

  @Prop()
  sector: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  check_size: string;

  @Prop()
  phone: string;

  // Remove duplicate created_at since timestamps: true already creates createdAt and updatedAt
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);
