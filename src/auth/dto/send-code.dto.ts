import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
