import { Controller, Get, Post, Body, Patch, Param, Delete ,Query} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticDto } from './dto/statistic.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  // @Post()
  // async triggerStatistic(@Body() statisticDto: StatisticDto) {
  //   // return this.statisticService.create(statisticDto);
  // }

  @Get("getStatistic")
  async getStatistic(@Query() statisticDto: StatisticDto) {  
    return this.statisticService.getStatistic(statisticDto);
  }
}
