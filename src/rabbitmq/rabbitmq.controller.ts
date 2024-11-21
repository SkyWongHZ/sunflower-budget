import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitMQService) {}

 
}
