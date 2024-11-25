import {
    IsString,
    IsEmail,
    IsInt,
    IsOptional,
    MinLength,
    IsEnum,
  } from 'class-validator';
  import { Transform, Type } from 'class-transformer';

export class StatisticDto {
    @IsString()
    type: 'daily'|'monthly'='daily';
  
    @IsString()
    date: string;
  
}




  