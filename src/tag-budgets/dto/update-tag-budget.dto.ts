import { PartialType } from '@nestjs/mapped-types';
import { CreateTagBudgetDto } from './create-tag-budget.dto';

export class UpdateTagBudgetDto extends PartialType(CreateTagBudgetDto) {}
