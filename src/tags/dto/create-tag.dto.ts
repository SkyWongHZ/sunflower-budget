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


enum Role {
  SUPER_ADMIN='SUPER_ADMIN',
  FINANCE_ADMIN='FINANCE_ADMIN',
  NORMAL_USER='NORMAL_USER',
}

export class CreateTagDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsEnum(TagType)
  type: TagType;

  @IsEnum(Role)
  role: Role;
}
