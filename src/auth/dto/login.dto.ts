import { IsString, MinLength,Length, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6,6)
  code: string;

}