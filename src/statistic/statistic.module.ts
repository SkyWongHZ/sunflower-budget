import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';  // 使用官方的 @nestjs/bull
import {  StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
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





