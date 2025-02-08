import { Injectable } from '@nestjs/common';
import { CreateTagBudgetDto } from './dto/create-tag-budget.dto';
import { UpdateTagBudgetDto } from './dto/update-tag-budget.dto';

@Injectable()
export class TagBudgetsService {
  create(createTagBudgetDto: CreateTagBudgetDto) {
    return 'This action adds a new tagBudget';
  }

  findAll() {
    return `This action returns all tagBudgets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagBudget`;
  }

  update(id: number, updateTagBudgetDto: UpdateTagBudgetDto) {
    return `This action updates a #${id} tagBudget`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagBudget`;
  }
}
