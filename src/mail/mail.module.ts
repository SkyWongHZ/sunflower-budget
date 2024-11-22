import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailConsumer } from './mail.consumer';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import {RabbitmqModule}  from 'src/rabbitmq/rabbitmq.module'

@Module({
  controllers: [MailController],
  providers: [MailService,MailConsumer],
  imports: [
    RabbitmqModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.qq.com',
        port: 587,
        secure: false,  
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
      },
    }),
  ],
  exports: [MailService,MailConsumer],
})
export class MailModule {}
