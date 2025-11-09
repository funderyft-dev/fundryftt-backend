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
  fund: string; // Could be number if you prefer, but keeping as string for "$2,000,000" format

  @Prop({ default: 'Active', enum: ['Active', 'Inactive', 'Pending'] })
  status: string;

  @Prop({ required: true })
  country: string;

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

  @Prop({ default: Date.now })
  created_at: Date;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);