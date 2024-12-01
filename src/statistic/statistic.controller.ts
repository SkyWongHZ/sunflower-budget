import { Controller, Get, Post, Body, Patch, Param, Delete ,Query} from '@nestjs/common';
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
  async handleDailystatistic(job: Job) {
    return this.statisticService.trigger(job.data);
  }

  @Process('monthly-statistic')
  async handleMonthlystatistic(job: Job) {
    return this.statisticService.trigger(job.data);
  }
}
