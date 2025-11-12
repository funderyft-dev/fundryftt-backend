import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ default: 'active' })
  status: string; // active, inactive, archived

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
