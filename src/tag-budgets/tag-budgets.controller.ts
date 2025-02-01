import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagBudgetsService } from './tag-budgets.service';
import { CreateTagBudgetDto } from './dto/create-tag-budget.dto';
import { UpdateTagBudgetDto } from './dto/update-tag-budget.dto';

@Controller('tag-budgets')
export class TagBudgetsController {
  constructor(private readonly tagBudgetsService: TagBudgetsService) {}

  @Post()
  create(@Body() createTagBudgetDto: CreateTagBudgetDto) {
    return this.tagBudgetsService.create(createTagBudgetDto);
  }

  @Get()
  findAll() {
    return this.tagBudgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagBudgetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagBudgetDto: UpdateTagBudgetDto) {
    return this.tagBudgetsService.update(+id, updateTagBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagBudgetsService.remove(+id);
  }
}
