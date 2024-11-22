import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { MailService } from './mail.service';

@Injectable()
export class MailConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.setupConsumer();
  }

  private async setupConsumer() {
    await this.rabbitMQService.consume(async (message) => {
      try {
        if (message.type === 'verify-code') {
          const { email, code } = message.data;
          await this.mailService.sendVerificationCode(email, code);
          console.log(`Verification code sent to ${email}`);
        }
      } catch (error) {
        console.error('Error processing mail message:', error);
        // 这里可以添加重试逻辑s
      }
    });
  }
}
