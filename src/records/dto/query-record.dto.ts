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
  
  export class QueryRecordDto {
    @IsString()
    @IsOptional()
    tagId?: string;
  
    @IsString()
    @IsOptional()
    startDate: string;
  
    @IsString()
    @IsOptional()
    endDate: string;
  
    @IsEnum(RecordType)
    @IsOptional()
    type: RecordType;
  
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageIndex: number;
  
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number;
  }
  