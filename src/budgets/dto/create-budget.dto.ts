import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  month: number;
}
