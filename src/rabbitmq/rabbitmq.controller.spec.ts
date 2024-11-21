import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqService } from './rabbitmq.service';

describe('RabbitmqController', () => {
  let controller: RabbitmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitmqController],
      providers: [RabbitmqService],
    }).compile();

    controller = module.get<RabbitmqController>(RabbitmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
