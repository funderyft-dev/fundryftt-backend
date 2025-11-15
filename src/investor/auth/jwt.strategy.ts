import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from '../schema/investor.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'investor-secret-key',
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    this.logger.log('🔍 Validating JWT payload:', payload);

    if (!payload || !payload.sub) {
      this.logger.error('❌ Invalid token payload - no sub field');
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      const investor = await this.investorModel.findById(payload.sub);
      if (!investor) {
        this.logger.error(`❌ Investor not found for id: ${payload.sub}`);
        throw new UnauthorizedException('Investor not found');
      }

      // Check if investor is active
      if (investor.status !== 'Active') {
        this.logger.error(`❌ Investor not active: ${investor.status}`);
        throw new UnauthorizedException('Investor account is not active');
      }

      this.logger.log(`✅ JWT validated for investor: ${investor.email}`);

      return {
        userId: payload.sub,
        _id: investor._id,
        email: investor.email,
        role: 'investor',
        name: investor.name,
      };
    } catch (error) {
      this.logger.error('❌ Error validating JWT:', error);
      throw new UnauthorizedException('Error validating token');
    }
  }
}
