import { Injectable ,ConflictException} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}


  async create(createRecordDto: CreateRecordDto) {
    const tag= await  this.prisma.tag.findUnique({
      where: {
        id: createRecordDto.tagId,
        isDeleted: false,
      },
    });
    console.log('tag',tag);
    if(tag.type===createRecordDto.type&&tag.id===createRecordDto.tagId){
      return await this.prisma.record.create({
        data: {
          ...createRecordDto,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });
    }else {
      throw new ConflictException('标签类型不匹配');
    }
  }




  async findAll(params: {
    tagId?:string;
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
      ...(tagId&&{tagId}) ,
      ...(type && { type }),
      ...(startDate&&{ recordTime:{
        gte:startDate
      }}),
      ...(endDate&&{recordTime:{
        lte:endDate
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

    const  income= records.filter(item=>item.type==='income').reduce((prev,cur)=>prev+cur.amount,0)
    const  expense= records.filter(item=>item.type==='expense').reduce((prev,cur)=>prev+cur.amount,0)
    const netIncome=income-expense
    console.log('income: ', income);

    return {
      list: records,
      total,
      netIncome,
    };
  }


  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  // update(id: number, updateRecordDto: UpdateRecordDto) {
  //   return `This action updates a #${id} record`;
  // }

  async update(id: string, updateRecordDto: UpdateRecordDto) {
    return await this.prisma.record.update({
      where: {
        id,
        isDeleted: false,
      },
      data: updateRecordDto,
      select: {
        id: true,
      },
    });
  }


  // remove(id: number) {
  //   return `This action removes a #${id} record`;
  // }

  async remove(id: string) {
    return await this.prisma.record.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  }
}
