import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WorkWeixinWebhookModule } from '../webhook/webhook.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [WorkWeixinWebhookModule, NotificationsModule],
  controllers: [BudgetsController],
  providers: [BudgetsService, PrismaService],
})
export class BudgetsModule {}




