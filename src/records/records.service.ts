import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}
  create(createRecordDto: CreateRecordDto) {
    return 'This action adds a new record';
  }


  async findAll(params: {
    tagId:string;
    type?: 'income' | 'expense';
    pageIndex: number;
    pageSize: number;
    startDate?:string;
    endDate?:string;
  }) {
    const { tagId,type, pageIndex, pageSize,startDate,endDate } = params;
    const skip = (pageIndex - 1) * pageSize;
    const  where= {
      isDeleted: false,
      tagId,
      ...(type && { type }),
      ...(startDate&&{ recordTime:{
        gte:new Date(startDate)
      }}),
      ...(endDate&&{recordTime:{
        lte:new Date(endDate) 
      }}),
    }
    const [records, total] = await Promise.all([
      this.prisma.record.findMany({
        skip,
        take: pageSize,
        where,
        select: {
          id: true,
          recordTime: true,
          remark: true,
          type: true,
          amount:true,
          tag:{
            select:{
              id:true,
              name:true,
              icon:true,       
            }
          },
        },
        orderBy:{
          recordTime:'desc'
        },
      }),
      this.prisma.record.count({
        where,
      }),
    ]);

    return {
      list: records,
      total,
    };
  }


  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
