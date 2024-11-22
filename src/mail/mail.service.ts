import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendVerificationCode(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '验证码',
      html: `
              <div style="padding: 20px;">
                  <h2>您的验证码是：</h2>
                  <h1 style="color: #1a73e8;">${code}</h1>
                  <p>验证码5分钟内有效</p>
              </div>
          `,
    });
  }
}
