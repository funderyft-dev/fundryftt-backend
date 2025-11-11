// admin/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../schema/admin.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'admin-secret-key',
    });
  }

  async validate(payload: any) {
    const admin = await this.adminModel.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}