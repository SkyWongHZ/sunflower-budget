import {
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

enum  TagType{
    INCOME='income',
    EXPENSE='expense'
}

export class CreateTagDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsEnum(TagType)
  type: TagType;
}
