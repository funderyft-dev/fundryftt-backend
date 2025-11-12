import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Investor } from '../schema/investor.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Added 'jwt' name
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<Investor>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'investor-secret-key',
    });
  }

  async validate(payload: any) {
    const investor = await this.investorModel.findById(payload.sub);
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Return investor document for access in controllers
    return {
      _id: investor._id,
      email: investor.email,
      name: investor.name,
      role: 'investor', // Fixed role from 'admin' to 'investor'
    };
  }
}
