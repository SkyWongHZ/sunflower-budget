import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { connect,Channel, ChannelWrapper, AmqpConnectionManager } from 'amqp-connection-manager';
import { RABBITMQ_CONFIG } from './rabbitmq.constants';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection:AmqpConnectionManager;
  private channelWrapper:ChannelWrapper;

  async onModuleInit() {
    // 创建连接
    this.connection = connect(RABBITMQ_CONFIG.urls);

    // 创建channel
    this.channelWrapper = this.connection.createChannel({
      setup: (channel:Channel) => {
        return channel.assertQueue(RABBITMQ_CONFIG.queue, { durable: false });
      },
    });
    await this.channelWrapper.waitForConnect();
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  async sendMessage(message: any) {
    try {
      await this.channelWrapper.publish(
        '', 
        RABBITMQ_CONFIG.queue, 
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      console.error('Error publishing message', error);
      throw error;
    }
  }

  async consume(callback: (message: any) => void) {
    try {
      await this.channelWrapper.consume(RABBITMQ_CONFIG.queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channelWrapper.ack(message);
        }
      });
    } catch (error) {
      console.error('Error consuming message', error);
      throw error;
    }
  }
}