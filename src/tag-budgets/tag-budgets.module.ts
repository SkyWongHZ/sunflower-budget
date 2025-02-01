import { Module } from '@nestjs/common';
import { TagBudgetsService } from './tag-budgets.service';
import { TagBudgetsController } from './tag-budgets.controller';

@Module({
  controllers: [TagBudgetsController],
  providers: [TagBudgetsService],
})
export class TagBudgetsModule {}
