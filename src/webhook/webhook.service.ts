import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly workWeixinKey: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.workWeixinKey = this.configService.get<string>('WORK_WEIXIN_WEBHOOK_KEY');
  }

  async sendWorkWeixinMessage(message: string) {
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${this.workWeixinKey}`;
      
      const { data } = await axios.post(url, {
        msgtype: 'markdown',
        markdown: { content: message }
      });

      this.logger.log('企业微信webhook发送成功:', data);
      return data;
    } catch (error) {
      this.logger.error('企业微信webhook发送失败:', error);
      throw error;
    }
  }

  formatBudgetMessage(budget: any, spentAmount: number, spentPercentage: number) {
    return `## 预算支出提醒 ⚠️\n` +
           `**月份**: ${budget.year}年${budget.month}月\n` +
           `**预算金额**: ¥${budget.amount}\n` +
           `**当前支出**: ¥${spentAmount}\n` +
           `**支出比例**: ${spentPercentage.toFixed(2)}%\n` +
           `**剩余金额**: ¥${(budget.amount - spentAmount).toFixed(2)}\n` +
           `请注意控制支出！`;
  }
}