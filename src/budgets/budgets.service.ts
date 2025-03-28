import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { WebhookService } from '../webhook/webhook.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationLevel } from '../notifications/dto/create-notification.dto';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private webhookService: WebhookService,
    private notificationsService: NotificationsService,
  ) {}

  // 创建预算（不再依赖用户ID）
  async create(createBudgetDto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
      },
    });
  }

  // 获取某月预算（不再依赖用户ID）
  async findOne(year: number, month: number) {
    return this.prisma.budget.findFirst({
      where: {
        year,
        month,
        isDeleted: false,
      },
    });
  }

  // 获取预算使用情况（不再依赖用户ID）
  async getBudgetUsage(year: number, month: number) {
    const budget = await this.findOne(year, month);
    if (!budget) return null;

    // 构建日期前缀匹配
    const datePrefix = `${year}-${month.toString().padStart(2, '0')}`;

    // 计算当月支出
    const totalExpense = await this.prisma.record.aggregate({
      where: {
        type: 'expense',
        recordTime: {
          startsWith: datePrefix // 使用字符串前缀匹配
        },
        isDeleted: false,
      },
      _sum: {
        amount: true,
      },
    });

    console.log('查询条件:', {
      type: 'expense',
      recordTime: {
        startsWith: datePrefix
      },
      isDeleted: false
    });

    const spentAmount = totalExpense._sum.amount || 0;
    console.log('找到的记录:', spentAmount);
    console.log('totalExpense', totalExpense);

    return {
      budget,
      spentAmount,
      spentPercentage: (spentAmount / budget.amount) * 100,
      remainingAmount: budget.amount - spentAmount,
    };
  }

  // 检查预算并创建通知（不再依赖用户ID）
  async checkBudgetAndNotify(year: number, month: number) {
    const usage = await this.getBudgetUsage(year, month);
    if (!usage) return null;

    const { spentPercentage } = usage;
    let notificationLevel: NotificationLevel = null;
    let message = '';

    // 根据使用比例设置通知级别和消息
    if (spentPercentage >= 90) {
      notificationLevel = NotificationLevel.HIGH;
      message = `月度预算已使用 ${spentPercentage.toFixed(1)}%，即将超出预算！`;
    } else if (spentPercentage >= 80) {
      notificationLevel = NotificationLevel.MEDIUM;
      message = `月度预算已使用 ${spentPercentage.toFixed(1)}%，请注意控制支出。`;
    } else if (spentPercentage >= 70) {
      notificationLevel = NotificationLevel.LOW;
      message = `月度预算已使用 ${spentPercentage.toFixed(1)}%。`;
    }

    // 只在需要发送通知时处理
    if (notificationLevel) {
      // 检查是否已存在相同级别的通知（现在不再按用户过滤）
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          type: NotificationType.MONTHLY_BUDGET,
          level: notificationLevel,
          data: {
            equals: {
              year,
              month,
            }
          },
        }
      });

      // 如果没有发送过该级别的通知，创建新通知
      if (!existingNotification) {
        // 使用通知服务创建通知
        await this.notificationsService.create({
          userId: null, // 不再与特定用户关联
          type: NotificationType.MONTHLY_BUDGET,
          message,
          level: notificationLevel,
          data: {
            year,
            month,
            budgetAmount: usage.budget.amount,
            spentAmount: usage.spentAmount,
            spentPercentage,
            remainingAmount: usage.remainingAmount
          },
        });

        // 发送企业微信通知
        const webhookMessage = this.webhookService.formatBudgetMessage(
          usage.budget,
          usage.spentAmount,
          spentPercentage
        );
        await this.webhookService.sendWorkWeixinMessage(webhookMessage);
      }
    }

    return usage;
  }
}
