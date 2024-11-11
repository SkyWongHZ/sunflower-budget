import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async create(createTagDto: CreateTagDto, userId: string) {
    return this.prisma.tag.create({
      data: {
        ...createTagDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findAll(params: {
    userId: string;
    type?: 'income' | 'expense';
    pageIndex: number;
    pageSize: number;
  }) {
    const { userId, type, pageIndex, pageSize } = params;
    const skip = (pageIndex - 1) * pageSize;
    const tags = await this.prisma.tag.findMany({
      skip,
      take: pageSize,
      where: {
        userId,
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
        userId,
        ...(type && { type }),
      },
    });
    return {
      list: tags,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    return await this.prisma.tag.update({
      where: {
        id,
      },
      data: updateTagDto,
      select: {
        id: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    return await this.prisma.tag.delete({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });
  }
}
