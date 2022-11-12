import { Test, TestingModule } from '@nestjs/testing';
import { SubTodoController } from './sub-todo.controller';

describe('SubTodoController', () => {
  let controller: SubTodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubTodoController],
    }).compile();

    controller = module.get<SubTodoController>(SubTodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
