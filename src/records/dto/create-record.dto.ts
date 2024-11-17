import {
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
  MinLength,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateRecordDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  tagId: string;

  @IsEnum(RecordType)
  type: RecordType;
                  
  // @IsString()
  // startDate: string;

  @IsString()
  remark?: string;

  @IsString()
  recordTime: string;
}
