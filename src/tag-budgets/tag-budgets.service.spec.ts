import { Test, TestingModule } from '@nestjs/testing';
import { TagBudgetsService } from './tag-budgets.service';

describe('TagBudgetsService', () => {
  let service: TagBudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagBudgetsService],
    }).compile();

    service = module.get<TagBudgetsService>(TagBudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
