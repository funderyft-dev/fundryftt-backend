import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './schema/review.schema';
import { Deal, DealSchema } from '../../admin/deals/schema/deal.schema';
import { Investor, InvestorSchema } from '../schema/investor.schema';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Deal.name, schema: DealSchema },
      { name: Investor.name, schema: InvestorSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'investor-secret-key',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtStrategy],
  exports: [ReviewService],
})
export class ReviewModule {}
