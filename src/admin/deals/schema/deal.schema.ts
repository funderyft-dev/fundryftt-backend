import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DealDocument = Deal & Document;

@Schema({ timestamps: true })
export class Deal {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true })
  problem: string;

  @Prop({ required: true })
  whyNow: string;

  @Prop({ required: true })
  advantage: string;

  @Prop({ required: true })
  revenueModel: string;

  @Prop({ required: true })
  raisingAmount: number;

  @Prop({ required: true })
  yearFounded: number;

  @Prop({ required: true })
  country: string;

  @Prop()
  websiteLink: string;

  @Prop()
  deckLink: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  companyLogo: string;

  @Prop({ default: 'pending' })
  status: string; // pending, approved, rejected, completed

  // ADMIN-ONLY FIELDS
  @Prop({ default: null })
  fundTarget: number;

  @Prop({ default: null })
  deadline: Date;

  // ADD PDF UPLOAD FIELD
  @Prop({ default: null })
  dealDocument: string; // Cloudinary URL for PDF

  // NEW FIELDS
  @Prop({
    enum: ['seed', 'pre-seed', 'series A', 'series B', 'series C', 'other'],
    default: null,
  })
  round: string;

  @Prop({ default: null })
  totalRoundRaise: number;

  @Prop({ default: null })
  allocation: number;

  @Prop({ default: null })
  capitalCall: number;

  @Prop({ default: null })
  valuation: number;

  @Prop({ default: null })
  financialModel: string; // Link to financial model

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
