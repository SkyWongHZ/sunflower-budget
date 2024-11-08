import { IsString, IsEmail, IsInt, IsOptional, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  // @IsEmail()
  // email?: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  // @IsInt()
  // @Type(() => Number)  // 添加这个装饰器
  // @Transform(({ value }) => {
  //   if (value === null || value === undefined) return null;
  //   return parseInt(value);
  // })
  // age?: number;
}