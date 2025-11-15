// review.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async addReview(
    email: string, // Now using email instead of investorId
    dealId: string,
    comment: string,
  ): Promise<Review> {
    // Check if review already exists for this email and deal
    const existingReview = await this.reviewModel.findOne({
      email, // Use email to check for existing reviews
      dealId,
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this deal');
    }

    const review = new this.reviewModel({
      email, // Store email instead of investorId
      dealId,
      comment,
    });

    return review.save();
  }

  // Update other methods to use investorId instead of email
  async getReviewsByDeal(dealId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ dealId: new Types.ObjectId(dealId) })
      .populate('investorId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
