import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  otp: string | null;

  @Prop({ type: Date, default: null })
  otpExpires: Date | null;

  @Prop({ default: 'admin' })
  role: string;

  @Prop({ default: 0 })
  otpAttempts: number;

  @Prop({ type: Date, default: null })
  lastOtpSent: Date | null;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);