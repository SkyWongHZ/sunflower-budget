import { 
  Controller, 
  Get, 
  Post,
  Patch, 
  Delete,
  Param, 
  Body, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../common/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @User('id') userId: string,
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    createNotificationDto.userId = userId;
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(@User('id') userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @Get('unread/count')
  getUnreadCount(@User('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.notificationsService.findOne(id, userId);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Delete('cleanup')
  removeOldNotifications(
    @User('id') userId: string,
    @Query('days') days?: number
  ) {
    return this.notificationsService.removeOldNotifications(userId, days);
  }
}