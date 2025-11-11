import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'sub' })
  role: string; // super, sub

  @Prop({ default: 'active' })
  status: string; // active, inactive

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp: string;

  @Prop()
  otpExpires: Date;

  @Prop({ default: 0 })
  otpAttempts: number;

  @Prop()
  lastOtpSent: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);