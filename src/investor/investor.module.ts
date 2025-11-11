// investor.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { Investor, InvestorSchema } from "./schemas/investor.schema"
import { Note, NoteSchema } from 'src/admin/notes/schema/note.schema'; 
import { Portfolio, PortfolioSchema } from 'src/admin/portfolios/schema/portfolio.schema';

import { AuthController } from './controller/auth.controller'; 
import { PortfolioController } from './controller/portfolio.controller'; 
import { NotesController } from './controller/notes.controller'; 
import { DealsController } from './controller/deals.controller'; 

import { AuthService } from './service/auth.service'; 
import { OtpService } from './service/otp.service'; 
import { PortfolioService } from './service/portfolio.service'; 
import { NotesService } from './service/note.service'; 
import { DealsService } from './service/deals.service'; 

import { JwtStrategy } from './strategy/jwt.strategy'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Note.name, schema: NoteSchema },
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AuthController,
    PortfolioController,
    NotesController,
    DealsController,
  ],
  providers: [
    AuthService,
    OtpService,
    PortfolioService,
    NotesService,
    DealsService,
    JwtStrategy,
  ],
})
export class InvestorModule {}