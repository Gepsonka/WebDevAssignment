import { Test, TestingModule } from '@nestjs/testing';
import { AutocorrectService } from './autocorrect.service';

describe('AutocorrectService', () => {
  let service: AutocorrectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutocorrectService],
    }).compile();

    service = module.get<AutocorrectService>(AutocorrectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
