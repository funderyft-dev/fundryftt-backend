
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  // Get all reviews with populated data
  async getAllReviews(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('dealId', 'businessName industry') // Populate deal info
      .sort({ createdAt: -1 })
      .exec();
  }

  // Get reviews for a specific deal
  async getReviewsByDeal(dealId: string): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ dealId })
      .populate('dealId', 'businessName industry')
      .sort({ createdAt: -1 })
      .exec();

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for deal ${dealId}`);
    }

    return reviews;
  }

  // Get a specific review by ID
  async getReviewById(reviewId: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate('dealId', 'businessName industry')
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    return review;
  }

  // Get reviews with pagination
  async getReviewsWithPagination(page: number, limit: number = 10): Promise<{ reviews: Review[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find()
        .populate('dealId', 'businessName industry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel.countDocuments()
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get review statistics
  async getReviewStats(): Promise<any> {
    const totalReviews = await this.reviewModel.countDocuments();
    const reviewsByDeal = await this.reviewModel.aggregate([
      {
        $group: {
          _id: '$dealId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'deals',
          localField: '_id',
          foreignField: '_id',
          as: 'deal'
        }
      },
      {
        $unwind: '$deal'
      },
      {
        $project: {
          dealName: '$deal.businessName',
          reviewCount: '$count'
        }
      }
    ]);

    const recentReviews = await this.reviewModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('dealId', 'businessName')
      .exec();

    return {
      totalReviews,
      reviewsByDeal,
      recentReviews
    };
  }

  // Get reviews by email (if you want to see all reviews from a specific investor)
  async getReviewsByEmail(email: string): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find({ email })
      .populate('dealId', 'businessName industry')
      .sort({ createdAt: -1 })
      .exec();

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for email ${email}`);
    }

    return reviews;
  }
}