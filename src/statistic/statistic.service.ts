import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as moment  from   'moment'
import {StatisticData,TagStats}  from '../common/types/types'



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

  async trigger(params){
    const { type:statType, date} = params;
    const formattedDate = moment(date).format('YYYY-MM-DD');
     // 测试查询条件
     const testQuery = await this.prisma.record.findMany({
      where: {
        recordTime: {
          startsWith: formattedDate
        }
      },
      distinct: ['type']  // 查看所有可能的 type 值
    });
    console.log('数据库中的 type 值:', testQuery.map(r => r.type));
    let startDate,endDate
    if(statType==='monthly'){
      startDate = moment(formattedDate).startOf('month').format('YYYY-MM-DD');
      endDate = moment(formattedDate).endOf('month').format('YYYY-MM-DD');

    }else if(statType==='daily'){
      startDate = moment(formattedDate).startOf('day').format('YYYY-MM-DD');
      endDate = moment(formattedDate).endOf('day').format('YYYY-MM-DD');
    }

    const datePrefix=statType === 'monthly'?moment(formattedDate).format('YYYY-MM'):formattedDate
   
    const records= await  this.prisma.record.findMany({
      where: {
        recordTime: {
          // gte: startDate,
          // lte: endDate,
          startsWith: datePrefix
        },
        isDeleted: false
      },
      include: {
        tag: true,
      },
    })
    console.log('records',records);
    let totalAmount=0,income=0,expense=0,tagStatObj={}
    records.forEach((item)=>{
      totalAmount+=item.amount     
      if(item.type==='income'){
        income+=item.amount
      }else if(item.type==='expense'){
        expense+=item.amount
      }  
      const tagId=item.tag.id 
      if(!tagStatObj[tagId] ){
        tagStatObj[tagId]={
          name:item.tag.name,
          icon:item.tag.icon,
          type:item.tag.type,
          amount:0,
          count:0,
        }
      }
      tagStatObj[tagId].amount+=item.amount
      tagStatObj[tagId].count+=1
     
    })

    await this.prisma.statistics.upsert({
      where: {
        type_date: {
          type:statType,
          date,
        }
        
      },
      update: {
        totalAmount: totalAmount,
        income: income,
        expense: expense,
        date: formattedDate,
        type: statType,
        totalCount:records.length,
        tagStats:tagStatObj,
        updatedAt: new Date()
      },
      create: {
        totalAmount: totalAmount,
        income: income,
        expense: expense,
        date: formattedDate,
        type: statType,
        totalCount:records.length,
        tagStats:tagStatObj,
      },
    })

    
    return {
      message: `${statType}统计已完成，统计日期：${formattedDate}`
    };

  }
  
  

  
 
}
