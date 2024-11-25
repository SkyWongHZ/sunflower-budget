import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports:[TasksModule],
  controllers: [RecordsController],
  providers: [RecordsService,PrismaService],
})
export class RecordsModule {}
  