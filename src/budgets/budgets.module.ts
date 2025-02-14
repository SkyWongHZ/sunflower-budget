import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WorkWeixinWebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [WorkWeixinWebhookModule],
  controllers: [BudgetsController],
  providers: [BudgetsService,PrismaService],
})
export class BudgetsModule {}




