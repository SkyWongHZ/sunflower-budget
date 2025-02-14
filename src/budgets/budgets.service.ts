import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { WebhookService } from '../webhook/webhook.service';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private webhookService: WebhookService,
  ) {}

  // 创建预算
  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        userId,
        ...createBudgetDto,
      },
    });
  }

  // 获取用户某月预算
  async findOne(userId: string, year: number, month: number) {
    return this.prisma.budget.findFirst({
      where: {
        userId,
        year,
        month,
        isDeleted: false,
      },
    });
  }

  // 获取预算使用情况
  async getBudgetUsage(userId: string, year: number, month: number) {
    const budget = await this.findOne(userId, year, month);
    if (!budget) return null;

    // // 格式化日期范围为字符串
    // const startDate = new Date(Date.UTC(year, month - 1, 1));  // 月初
    // const endDate = new Date(Date.UTC(year, month, 0));      // 月末


    // 构建日期前缀匹配
    const datePrefix = `${year}-${month.toString().padStart(2, '0')}`;


  //   console.log('查询日期范围:', {
  //     startDate: startDate.toISOString(),
  //     endDate: endDate.toISOString()
  // });

    // 计算当月支出
    const totalExpense = await this.prisma.record.aggregate({
        where: {
            // userId,
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
      // userId,
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

  // 检查预算并创建通知
  async checkBudgetAndNotify(userId: string, year: number, month: number) {
    const usage = await this.getBudgetUsage(userId, year, month);
    if (!usage) return null;

    const { spentPercentage } = usage;
    let notificationLevel: 'HIGH' | 'MEDIUM' | 'LOW' = null;
    let message = '';

    // 根据使用比例设置通知级别和消息
    if (spentPercentage >= 90) {
      notificationLevel = 'HIGH';
      message = `您的月度预算已使用 ${spentPercentage.toFixed(1)}%，即将超出预算！`;
    } else if (spentPercentage >= 80) {
      notificationLevel = 'MEDIUM';
      message = `您的月度预算已使用 ${spentPercentage.toFixed(1)}%，请注意控制支出。`;
    } else if (spentPercentage >= 70) {
      notificationLevel = 'LOW';
      message = `您的月度预算已使用 ${spentPercentage.toFixed(1)}%。`;
    }

    // 只在需要发送通知时处理
    if (notificationLevel) {
      // 检查是否已存在相同级别的通知
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          userId,
          type: 'MONTHLY_BUDGET',
          level: notificationLevel,
          data: {
            // 修改这里的 Json 查询方式
            equals: {
              year,
              month,
            }
          },
        }
      });

      // 如果没有发送过该级别的通知，创建新通知
      if (!existingNotification) {
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'MONTHLY_BUDGET',
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
