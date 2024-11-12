import { Injectable,ConflictException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async create(createTagDto: CreateTagDto) {
    const  exitTag=await this.prisma.tag.findFirst({
      where:{
        name:createTagDto.name,
        isDeleted:false,
      }
    })
    if(exitTag){
       throw new ConflictException('标签名已存在');
    }
    return this.prisma.tag.create({
      data: { 
        isDeleted:false,
        ...createTagDto,
      },
      select: {
        id: true,
      },
    });
  }

  async findAll(params: {
    type?: 'income' | 'expense';
    pageIndex: number;
    pageSize: number;
  }) {
    const { type, pageIndex, pageSize } = params;
    const skip = (pageIndex - 1) * pageSize;
    const tags = await this.prisma.tag.findMany({
      skip,
      take: pageSize,
      where: {
        isDeleted:false,
        ...(type && { type }),
      },
      select: {
        id: true,
        name: true,
        icon: true,
        type: true,
      },
    });
    const total = await this.prisma.tag.count({
      where: {
        ...(type && { type }),
        isDeleted:false,
      },
    });
    return {
      list: tags,
      total,
    };
  }

 
  async update(id: string, updateTagDto: UpdateTagDto) {
    const  exitTag=await this.prisma.tag.findFirst({
      where:{
        name:updateTagDto.name,
        isDeleted:false,
        id:{not:id}  
      }
    })
    if(exitTag){
       throw new ConflictException('标签名已存在');
    }
    return await this.prisma.tag.update({
      where: {
        id,
        isDeleted:false,
      },
      data: updateTagDto,
      select: {
        id: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.tag.update({
      where: {
        id,
        isDeleted:false,
      },
      data: {
        isDeleted:true,
        deletedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  }


 
}
