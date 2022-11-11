import { Test, TestingModule } from '@nestjs/testing';
import { SubTodoService } from './sub-todo.service';

describe('SubTodoService', () => {
  let service: SubTodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubTodoService],
    }).compile();

    service = module.get<SubTodoService>(SubTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
