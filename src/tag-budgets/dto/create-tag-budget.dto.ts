import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTagBudgetDto {
    @IsString()
    @IsNotEmpty()
    tagId: string;
  
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
