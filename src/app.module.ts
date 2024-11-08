import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { RecordsModule } from './records/records.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ UsersModule,LoggerModule, RecordsModule, TagsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
