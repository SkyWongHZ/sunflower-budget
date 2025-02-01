import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
