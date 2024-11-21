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
// import {LoginUserDto}  from   './dto/login-user.dto'
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
// import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
    private mailService: MailService,
    // private rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.setupConsumer();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    const code = Math.random().toString().slice(2, 8);
    await this.mailService.sendVerificationCode(sendCodeDto.email, code);
    await this.authService.saveVerificationCode(sendCodeDto.email, code);
    return { message: '验证码已发送' };
  }

  // private async setupConsumer() {
  //   await this.rabbitMQService.consume((message) => {
  //     console.log('Received message:', message); // 在控制台打印接收到的消息
  //   });
  // }

  // @Get('verify-rabbitmq')
  // @HttpCode(HttpStatus.OK)
  // async VerifyCode() {
  //   await this.rabbitMQService.sendMessage('hello  world');
  //   return { message: 'rabbitmq 消息发送' };
  // }
}
