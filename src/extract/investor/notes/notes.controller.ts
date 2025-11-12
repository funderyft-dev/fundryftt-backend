import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('extract/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getNotes(@Query('status') status?: string) {
    if (status) {
      return this.notesService.getNotesByStatus(status);
    }
    return this.notesService.getAllNotes();
  }

  @Delete(':id')
  deleteNote(@Param('id') id: string) {
    return this.notesService.deleteNote(id);
  }
}
