import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import moment  from   'moment'

interface TagStats{
  "name": string,   
  "icon": string,   
  "type": string,   
  "count": number,  
  "amount": number  
 
}

interface  StatisticData{
  "id":string
  "type":        string    // daily(日统计) 或 monthly(月统计)
  "date":        string  // 统计日期
  "totalAmount": number     // 总金额
  "totalCount" : number      // 总笔数
  "income":      number    // 收入金额
  "expense":     number    // 支出金额
  tagStats  :Record<string,TagStats>
  "updatedAt": string  
  "createdAt": string,    // 创建时间
}

@Injectable()
export class StatisticService {
  constructor( private prisma: PrismaService){}
  
  async getStatistic(params):Promise<StatisticData|null> {
    const { type, date} = params;
      const data= await this.prisma.statistics.findFirst({
        where: {
          ...(type && { type }),
          ...(date && { date }),
        },
        select: {
          id: true,
          type: true,
          date: true,
          totalAmount: true,
          totalCount:true,
          income:true,
          expense:true,
          tagStats:true,
          updatedAt:true,
          createdAt:true,
        },
      })
      if(!data){
        throw new NotFoundException("统计数据不存在")
        
      }
      return{
        ...data,
        createdAt: moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        tagStats:data.tagStats as  unknown as Record<string,TagStats> 
      }
  }


 
}
