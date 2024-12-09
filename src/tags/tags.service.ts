import { Injectable, ConflictException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async create(createTagDto: CreateTagDto,userId:string) {
    const exitTag = await this.prisma.tag.findFirst({
      where: {
        name: createTagDto.name,
        isDeleted: false,
      },
    });
    if (exitTag) {
      throw new ConflictException('标签名已存在');
    }
    return this.prisma.tag.create({
      data: {
        isDeleted: false,
        tagType: 'custom',
        ...createTagDto,
        userId,
      },
      select: {
        id: true,
      },
    });
  }

  async createPreset(createTagDto: CreateTagDto) {
    const exitTag = await this.prisma.tag.findFirst({
      where: {
        name: createTagDto.name,
        isDeleted: false,
      },
    });
    if (exitTag) {
      throw new ConflictException('标签名已存在');
    }
    return this.prisma.tag.create({
      data: {
        isDeleted: false,
        tagType: 'preset',
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
    userId?:string;
  }) {
    const { type, pageIndex, pageSize ,userId} = params;
    const skip = (pageIndex - 1) * pageSize;
    console.log('userId:', userId);
    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        skip,
        take: pageSize,
        where: {
          isDeleted: false,
          ...(type && { type }),
          OR: [
            { tagType: 'preset' },  // 预设标签所有人可见
            { userId, tagType: 'custom' }  // 自定义标签只看自己的
          ]
        },
        select: {
          id: true,
          name: true,
          icon: true,
          type: true,
        },
      }),
      this.prisma.tag.count({
        where: {
          ...(type && { type }),
          isDeleted: false,
        },
      }),
    ]);

    return {
      list: tags,
      total,
    };
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const exitTag = await this.prisma.tag.findFirst({
      where: {
        name: updateTagDto.name,
        isDeleted: false,
        id: { not: id },
      },
    });
    if (exitTag) {
      throw new ConflictException('标签名已存在');
    }
    return await this.prisma.tag.update({
      where: {
        id,
        isDeleted: false,
      },
      data: updateTagDto,
      select: {
        id: true,
      },
    });
  }

  async updatePreset(id: string, updateTagDto: UpdateTagDto) {
    const exitTag = await this.prisma.tag.findFirst({
      where: {
        name: updateTagDto.name,
        isDeleted: false,
        id: { not: id },
      },
    });
    if (exitTag) {
      throw new ConflictException('标签名已存在');
    }
    return await this.prisma.tag.update({
      where: {
        id,
        isDeleted: false,
        tagType: 'preset',
      },
      data: updateTagDto,
      select: {
        id: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.$transaction([
      this.prisma.record.updateMany({
        where: {
          tagId: id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }),
      this.prisma.tag.update({
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
      }),
    ]);
  }


  async removePreset(id: string) {
    return await this.prisma.$transaction([
      this.prisma.record.updateMany({
        where: {
          tagId: id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }),
      this.prisma.tag.update({
        where: {
          id,
          isDeleted: false,
          tagType:'preset',
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
        select: {
          id: true,
        },
      }),
    ]);
  }
}
