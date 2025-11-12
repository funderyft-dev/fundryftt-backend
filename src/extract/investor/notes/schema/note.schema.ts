import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop()
  linkedIn: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  editor: string;

  @Prop({ required: true })
  summary: string;

  @Prop()
  metaTag: string;

  @Prop({ default: 'draft' })
  status: string; // draft, published

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);