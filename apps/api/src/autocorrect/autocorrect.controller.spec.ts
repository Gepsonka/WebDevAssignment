import { Test, TestingModule } from '@nestjs/testing';
import { AutocorrectController } from './autocorrect.controller';

describe('AutocorrectController', () => {
  let controller: AutocorrectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutocorrectController],
    }).compile();

    controller = module.get<AutocorrectController>(AutocorrectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
