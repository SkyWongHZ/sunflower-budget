import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService,PrismaService],
})
export class BudgetsModule {}




