import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
    private rabbitMQService: RabbitMQService,
  ) {}



  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    const code = Math.random().toString().slice(2, 8);

    await this.rabbitMQService.sendMessage({
      type:'verify-code',
      data:{
        email:sendCodeDto.email,
        code
      }
    });
    // await this.mailService.sendVerificationCode(sendCodeDto.email, code);
    await this.authService.saveVerificationCode(sendCodeDto.email, code);
    return { message: '验证码加入消息队列' };
  }
}
