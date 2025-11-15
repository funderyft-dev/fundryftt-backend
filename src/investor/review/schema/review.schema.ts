import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true }) // Change back to String for email
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Deal', required: true })
  dealId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    maxlength: 1000,
  })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
// Make sure this export is present
export const ReviewSchema = SchemaFactory.createForClass(Review);
