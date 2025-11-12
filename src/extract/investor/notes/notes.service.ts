import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schema/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async getAllNotes(): Promise<Note[]> {
    return this.noteModel.find().sort({ createdAt: -1 }).exec();
  }

  async getNotesByStatus(status: string): Promise<Note[]> {
    return this.noteModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async updateNote(id: string, updateNoteDto: CreateNoteDto): Promise<Note> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(
        id,
        { 
          ...updateNoteDto,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async deleteNote(id: string): Promise<Note> {
    const deletedNote = await this.noteModel.findByIdAndDelete(id).exec();
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return deletedNote;
  }

  async getNotesStats(): Promise<any> {
    const stats = await this.noteModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalNotes = await this.noteModel.countDocuments();
    
    return {
      totalNotes,
      statusBreakdown: stats
    };
  }
}