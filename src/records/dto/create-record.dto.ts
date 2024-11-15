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

enum TagType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateRecordDto {
  @IsString()
  tagId: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsEnum(TagType)
  type: TagType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;
}
