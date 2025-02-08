import { Test, TestingModule } from '@nestjs/testing';
import { TagBudgetsController } from './tag-budgets.controller';
import { TagBudgetsService } from './tag-budgets.service';

describe('TagBudgetsController', () => {
  let controller: TagBudgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagBudgetsController],
      providers: [TagBudgetsService],
    }).compile();

    controller = module.get<TagBudgetsController>(TagBudgetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
