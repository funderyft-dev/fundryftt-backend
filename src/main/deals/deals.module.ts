// deals/deals.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { Deal, DealSchema } from './schemas/deal.schema';
import { MailerService } from 'src/mail/mail.service';
import { CloudinaryModule  } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }]),
    CloudinaryModule,
  ],
  controllers: [DealsController],
  providers: [DealsService, MailerService],
})
export class DealsModule {}