import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';
import { StatisticData, TagStats } from '../common/types/types';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StatisticService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('statistic') private statisticQueue: Queue
  ) {}

  async getStatistic(params): Promise<StatisticData | null> {
    const { type, date } = params;
    
    console.log('查询统计请求参数:', { type, date });
    
    // 处理日期参数，特别是针对月度统计
    let queryDate = date;
    if (type === 'monthly' && date && date.length <= 7) {
      // 对于月度统计，如果日期格式为 YYYY-MM，添加日期部分
      queryDate = moment(date + '-01').format('YYYY-MM-DD');
    } else if (date) {
      // 确保日期格式一致
      queryDate = moment(date).format('YYYY-MM-DD');
    }
    
    console.log('处理后的查询参数:', { type, originalDate: date, queryDate });
    
    // 先尝试直接查询
    let data = await this.prisma.statistics.findFirst({
      where: {
        ...(type && { type }),
        ...(queryDate && { date: queryDate }),
      },
      select: {
        id: true,
        type: true,
        date: true,
        totalAmount: true,
        totalCount: true,
        income: true,
        expense: true,
        tagStats: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    
    // 如果没有找到数据，对于月度统计可以尝试不同的日期格式
    if (!data && type === 'monthly') {
      console.log('尝试其他日期格式查询月度统计');
      
      // 查询所有统计记录，找出匹配的月度记录
      const allStats = await this.prisma.statistics.findMany({
        where: {
          type: 'monthly',
        },
        select: {
          id: true,
          type: true,
          date: true,
          totalAmount: true,
          totalCount: true,
          income: true,
          expense: true,
          tagStats: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      
      console.log('找到所有月度统计:', allStats.map(s => ({ id: s.id, date: s.date })));
      
      // 检查是否有匹配的月份
      const targetMonth = date.substring(0, 7); // 提取 YYYY-MM 部分
      data = allStats.find(s => s.date.startsWith(targetMonth));
      
      if (data) {
        console.log('找到匹配的月度统计:', { id: data.id, date: data.date });
      }
    }
    
    if (!data) {
      console.log('未找到统计数据');
      throw new NotFoundException('统计数据不存在');
    }
    
    console.log('返回统计数据:', { id: data.id, date: data.date, type: data.type });
    
    return {
      ...data,
      createdAt: moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      tagStats: data.tagStats as unknown as Record<string, TagStats>,
    };
  }

  async trigger(params) {
    const { type: statType, date } = params;
    
    // 针对月度和日度统计使用不同的日期处理逻辑
    let formattedDate;
    let datePrefix;
    
    if (statType === 'monthly') {
      // 如果是月度统计，确保日期格式为 YYYY-MM
      // 先规范化输入日期格式
      if (date.length <= 7) {  // 如果输入的是类似 "2025-03" 的格式
        formattedDate = moment(date + '-01').format('YYYY-MM-DD');  // 添加日期部分
        datePrefix = date;  // 直接使用原始输入的 YYYY-MM
      } else {
        formattedDate = moment(date).format('YYYY-MM-DD');
        datePrefix = moment(formattedDate).format('YYYY-MM');
      }
      console.log('月度统计 - 日期处理:', { 原始日期: date, 格式化日期: formattedDate, 查询前缀: datePrefix });
    } else {
      // 日度统计
      formattedDate = moment(date).format('YYYY-MM-DD');
      datePrefix = formattedDate;
      console.log('日度统计 - 日期处理:', { 原始日期: date, 格式化日期: formattedDate, 查询前缀: datePrefix });
    }
    
    // 测试查询条件
    const testQuery = await this.prisma.record.findMany({
      where: {
        recordTime: {
          startsWith: datePrefix,
        },
      },
      distinct: ['type'], // 查看所有可能的 type 值
    });
    console.log(
      '数据库中的 type 值:',
      testQuery.map((r) => r.type),
    );

    // 查询记录
    const records = await this.prisma.record.findMany({
      where: {
        recordTime: {
          startsWith: datePrefix,
        },
        isDeleted: false,
      },
      include: {
        tag: true,
      },
    });
    console.log('查询条件:', { datePrefix, statType });
    console.log(`找到记录数: ${records.length}`);
    
    let totalAmount = 0,
      income = 0,
      expense = 0,
      tagStatObj = {};
    records.forEach((item) => {
      totalAmount += item.amount;
      if (item.type === 'income') {
        income += item.amount;
      } else if (item.type === 'expense') {
        expense += item.amount;
      }
      const tagId = item.tag.id;
      if (!tagStatObj[tagId]) {
        tagStatObj[tagId] = {
          name: item.tag.name,
          icon: item.tag.icon,
          type: item.tag.type,
          amount: 0,
          count: 0,
        };
      }
      tagStatObj[tagId].amount += item.amount;
      tagStatObj[tagId].count += 1;
    });

    await this.prisma.statistics.upsert({
      where: {
        type_date: {
          type: statType,
          date: formattedDate,
        },
      },
      update: {
        totalAmount: totalAmount,
        income: income,
        expense: expense,
        date: formattedDate,
        type: statType,
        totalCount: records.length,
        tagStats: tagStatObj,
        updatedAt: new Date(),
      },
      create: {
        totalAmount: totalAmount,
        income: income,
        expense: expense,
        date: formattedDate,
        type: statType,
        totalCount: records.length,
        tagStats: tagStatObj,
      },
    });

    // 添加更多日志以便调试
    console.log('统计数据已保存:', {
      type: statType,
      date: formattedDate,
      recordCount: records.length,
      totalAmount,
      income,
      expense
    });

    return {
      message: `${statType}统计已完成，统计日期：${formattedDate}`,
      data: {
        type: statType,
        date: formattedDate,
        recordCount: records.length,
        totalAmount,
        income,
        expense
      }
    };
  }


  // @Cron('0 1 * * *')    // 每天凌晨1点
  // async scheduleDailyStatistics(){
  //   const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  //   await this.statisticQueue.add('daily-statistic', { 
  //     type: 'daily',
  //     date: yesterday 
  //   });
  // }




  @Cron('0 2 1 * *')    // 每月1号凌晨2点
  async scheduleMonthlyStatistics(){
    const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');
    await this.statisticQueue.add('monthly-statistic', { 
      type: 'monthly',
      date: lastMonth 
    });
  }
}
