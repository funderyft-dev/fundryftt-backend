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
import { JwtAuthGuard } from '../../admin/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guards';
import { ReviewService } from './review.service';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, AdminGuard) // Protect all admin review routes
// @UseGuards(AdminGuard) // If you have specific admin guard
export class AdminReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Get all reviews
  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }
}
