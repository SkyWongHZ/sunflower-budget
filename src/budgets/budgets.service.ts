import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

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

    // 格式化日期范围为字符串
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 1).toISOString().split('T')[0];

    // 计算当月支出
    const totalExpense = await this.prisma.record.aggregate({
      where: {
        userId,
        type: 'expense',
        recordTime: {
          gte: startDate,
          lt: endDate,
        },
        isDeleted: false,
      },
      _sum: {
        amount: true,
      },
    });

    const spentAmount = totalExpense._sum.amount || 0;


    

    return {
      budget,
      spentAmount,
      spentPercentage: (spentAmount / budget.amount) * 100,
      remainingAmount: budget.amount - spentAmount,
    };
  }
}
