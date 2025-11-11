import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../../admin/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guards';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard, AdminGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  createNote(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.createNote(createNoteDto);
  }

  @Get()
  getNotes(@Query('status') status?: string) {
    if (status) {
      return this.notesService.getNotesByStatus(status);
    }
    return this.notesService.getAllNotes();
  }

  @Get('stats')
  getNotesStats() {
    return this.notesService.getNotesStats();
  }

  @Get(':id')
  getNote(@Param('id') id: string) {
    return this.notesService.getNoteById(id);
  }

  @Put(':id')
  updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: CreateNoteDto,
  ) {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: string) {
    return this.notesService.deleteNote(id);
  }
}