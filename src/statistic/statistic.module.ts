import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';  // 使用官方的 @nestjs/bull
import {  StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '118.178.184.13',
        port: 6379,
        password: '密码',
        maxRetriesPerRequest: 3,
        connectTimeout: 15000,  // 15秒连接超时
      },
      defaultJobOptions: {
        attempts: 3,  // 任务重试次数
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({  
      name: 'statistic',  // 队列名称
    }),
  ],
  controllers: [StatisticController],
  providers: [StatisticService, PrismaService],
})
export class StatisticModule {}





