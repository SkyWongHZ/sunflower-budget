import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { RecordsModule } from './records/records.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticModule } from './statistic/statistic.module';
import { BudgetsModule } from './budgets/budgets.module';
import { TagBudgetsModule } from './tag-budgets/tag-budgets.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    LoggerModule,
    RecordsModule,
    TagsModule,
    AuthModule,
    MailModule,
    RabbitmqModule,
    TasksModule,
    StatisticModule,
    BudgetsModule,
    TagBudgetsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
