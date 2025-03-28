// src/budgets/budgets.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  findOne(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.budgetsService.findOne(year, month);
  }

  @Get('usage')
  getBudgetUsage(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.budgetsService.getBudgetUsage(year, month);
  }

  @Get('check')
  checkBudget(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.budgetsService.checkBudgetAndNotify(year, month);
  }
}
