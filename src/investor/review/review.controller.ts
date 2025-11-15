import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('investor/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post(':dealId')
  // async createReview(
  //   @Param('dealId') dealId: string,
  //   @Body() body: { comment: string },
  //   @Request() req,
  // ) {
  //   // Add debug logging to check the user object
  //   // console.log('User from request:', req.user);

  //   if (!req.user || !req.user.userId) {
  //     throw new UnauthorizedException('User not authenticated properly');
  //   }

  //   return this.reviewService.createReview(
  //     req.user.userId, // This should now work
  //     dealId,
  //     body.comment,
  //   );
  // }

  // @Get('deal/:dealId')
  // async getDealReviews(@Param('dealId') dealId: string) {
  //   return this.reviewService.getDealReviews(dealId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('my-reviews')
  // async getMyReviews(@Request() req) {
  //   if (!req.user || !req.user.userId) {
  //     throw new UnauthorizedException('User not authenticated properly');
  //   }
  //   return this.reviewService.getInvestorReviews(req.user.userId);
  // }

 

  // @UseGuards(JwtAuthGuard)
  // @Put(':reviewId')
  // async updateReview(
  //   @Param('reviewId') reviewId: string,
  //   @Body() body: { comment: string },
  //   @Request() req,
  // ) {
  //   if (!req.user || !req.user.userId) {
  //     throw new UnauthorizedException('User not authenticated properly');
  //   }
  //   return this.reviewService.updateReview(reviewId, req.user.userId, body);
  // }

}
