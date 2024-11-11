import {
    IsString,
    IsEmail,
    IsInt,
    IsOptional,
    MinLength,
    IsEnum,
    IsNumber,
    Min,
  } from 'class-validator';
  import { Transform, Type } from 'class-transformer';
  
  enum  TagType{
      INCOME='income',
      EXPENSE='expense'
  }
  
  export class QueryTagDto {
    @IsOptional()
    @IsEnum(TagType)
    type?: TagType;
    
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    pageIndex: number;
    
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    pageSize: number;
  
  }
  


