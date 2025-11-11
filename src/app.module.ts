import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DealsModule } from './main/deals/deals.module';
import { AdminModule } from './admin/admin.module';
import { InvestorsModule } from './admin/investors/investors.module';
import { NotesModule } from './admin/notes/notes.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ServiceController } from './investor/investor.controller';
import { ControllerController } from './investor/investor.service';

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
    InvestorsModule,
    DealsModule,
    AdminModule,
    NotesModule,
    CloudinaryModule,
  ],
  controllers: [ServiceController, ControllerController],
})
export class AppModule {}
