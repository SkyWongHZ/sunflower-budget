// src/budgets/budgets.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { User } from '../common/decorators/user.decorator';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@User('id') userId: string, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(userId, createBudgetDto);
  }

  @Get()
  findOne(
    @User('id') userId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.budgetsService.findOne(userId, year, month);
  }

  @Get('usage')
  getBudgetUsage(
    @User('id') userId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.budgetsService.getBudgetUsage(userId, year, month);
  }
}
