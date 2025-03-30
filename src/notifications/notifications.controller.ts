import { 
  Controller, 
  Get, 
  UseGuards
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../common/decorators/user.decorator';

/**
 * 通知控制器 - 暂时不暴露给用户
 * 通知功能目前仅供系统内部使用，预算模块会创建通知但不提供查询接口
 */
// @UseGuards(AuthGuard)
// @Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 获取通知列表接口 - 暂时不暴露给用户
   */
  // @Get()
  findAll(@User('id') userId: string) {
    return this.notificationsService.findAll(userId);
  }
}