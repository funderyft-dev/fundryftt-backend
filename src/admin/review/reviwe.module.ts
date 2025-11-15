import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './schema/review.schema';
import { Deal, DealSchema } from '../deals/schema/deal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Deal.name, schema: DealSchema }, // For population
    ]),
  ],
  controllers: [AdminReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class AdminReviewModule {}
