import { Controller, Get, Post, Body, Query} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticDto } from './dto/statistic.dto';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Controller('statistic')
@Processor('statistic')
export class StatisticController {
  constructor(
    private readonly statisticService: StatisticService
    // @Inject('statistic_SERVICE') private client: ClientProxy
  ) {}

  @Post("trigger")
  async triggerStatistic(@Body() statisticDto: StatisticDto) {
    return this.statisticService.trigger(statisticDto);
  }

  @Get("getStatistic")
  async getStatistic(@Query() statisticDto: StatisticDto) {  
    return this.statisticService.getStatistic(statisticDto);
  }

  // Bull 队列处理器
  @Process('daily-statistic')
  async handleDailyStatistic(job: Job) {
    console.log('开始处理队列任务', job.id);
    console.log('任务数据：', job.data);
    const result=await this.statisticService.trigger(job.data);
    console.log('result: ', result);
    return result;
  }

  @Process('monthly-statistic')
  async handleMonthlyStatistic(job: Job) {
    return await this.statisticService.trigger(job.data);
  }
}
