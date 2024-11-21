import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  controllers: [RabbitmqController],
  providers: [RabbitMQService],
  exports:[RabbitMQService],
})
export class RabbitmqModule {}
