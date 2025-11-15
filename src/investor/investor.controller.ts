import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvestorService } from './investor.service';
import { ReviewService } from './review/review.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('investor')
export class InvestorController {
  constructor(
    private readonly investorService: InvestorService,
    private readonly reviewService: ReviewService,
  ) {}

  @Get('deals')
  async getAllDeals() {
    return this.investorService.getAllDeals();
  }

  @Get('deals/:id')
  async getDealById(@Param('id') id: string) {
    return this.investorService.getDealById(id);
  }

  @Get('deals/:id/reviews')
  async getDealReviews(@Param('id') id: string) {
    return this.reviewService.getReviewsByDeal(id);
  }

  @Get('deals/industry/:industry')
  async getDealsByIndustry(@Param('industry') industry: string) {
    return this.investorService.getDealsByIndustry(industry);
  }

  @Get('deals/featured')
  async getFeaturedDeals() {
    return this.investorService.getFeaturedDeals();
  }

  @UseGuards(JwtAuthGuard)
  @Get('deals/protected/all')
  async getAllDealsProtected() {
    return this.investorService.getAllDeals();
  }

  @Post('deals/:id/reviews')
  async addReview(
    @Param('id') dealId: string,
    @Body() reviewData: { comment: string; email: string }, // Add email back
  ) {
    return this.reviewService.addReview(
      reviewData.email,
      dealId,
      reviewData.comment,
    );
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Delete('deals/:id/reviews')
  //   async deleteReview(@Param('id') dealId: string, @Request() req) {
  //     const investorId = req.user.userId;
  //     return this.reviewService.deleteReview(investorId, dealId);
  //   }
}
