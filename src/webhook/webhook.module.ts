import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ConfigModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WorkWeixinWebhookModule {}