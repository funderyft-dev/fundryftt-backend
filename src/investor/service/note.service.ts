// services/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../../admin/notes/schema/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async getAllNotes(): Promise<Note[]> {
    return this.noteModel
      .find({ status: 'published' }) // Only get published notes
      .sort({ createdAt: -1 }) // Sort by latest first
      .exec();
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.noteModel
      .findOne({
        _id: id,
        status: 'published',
      })
      .exec();

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async getNotesByStatus(status: string): Promise<Note[]> {
    return this.noteModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async searchNotes(query: string): Promise<Note[]> {
    return this.noteModel
      .find({
        status: 'published',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } },
          { metaTag: { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getNotesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Note[]> {
    return this.noteModel
      .find({
        status: 'published',
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .exec();
  }
}
