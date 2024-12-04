import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';  // 使用官方的 @nestjs/bull
import {  StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService ,ConfigModule} from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot(), 
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host:  '118.178.184.13',      // 从配置服务获取
          port: 6379,
          password: configService.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: 3,
          connectTimeout: 15000,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      })
     
    }),
    BullModule.registerQueue({  
      name: 'statistic',  // 队列名称
    }),
  ],
  controllers: [StatisticController],
  providers: [StatisticService, PrismaService,StatisticController],
})
export class StatisticModule {}





