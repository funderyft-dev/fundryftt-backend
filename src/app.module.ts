import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExtractNotesModule } from './extract/investor/notes/notes.module';
import { DealsModule } from './main/deals/deals.module';
import { AdminModule } from './admin/admin.module';
import { NotesModule } from './admin/notes/notes.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ExtractPortfoliosModule } from './extract/portfolios/portfolios.module';
import { InvestorModule } from './investor/investor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    InvestorModule,
    ExtractNotesModule,
    ExtractPortfoliosModule,
    DealsModule,
    AdminModule,
    NotesModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
