// controllers/notes.controller.ts
import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  ParseUUIDPipe,
  BadRequestException 
} from '@nestjs/common';
import { NotesService } from '../service/note.service';
import { Note } from 'src/admin/notes/schema/note.schema'; 

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(): Promise<Note[]> {
    return this.notesService.getAllNotes();
  }

  @Get('search')
  async searchNotes(@Query('q') query: string): Promise<Note[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }
    return this.notesService.searchNotes(query.trim());
  }

  @Get('date-range')
  async getNotesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Note[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('Both startDate and endDate are required');
    }
    return this.notesService.getNotesByDateRange(startDate, endDate);
  }

  @Get('status/:status')
  async getNotesByStatus(@Param('status') status: string): Promise<Note[]> {
    const validStatuses = ['draft', 'published'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status. Use: draft or published');
    }
    return this.notesService.getNotesByStatus(status);
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return this.notesService.getNoteById(id);
  }
}