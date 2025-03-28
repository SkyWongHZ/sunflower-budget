import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建通知 - 仅供内部系统使用，不暴露为API
   * 主要被预算模块调用，用于在预算使用达到特定阈值时自动创建通知
   */
  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findAll(userId?: string) {
    const where = {};
    
    if (userId) {
      where['userId'] = userId;
    }
    
    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}