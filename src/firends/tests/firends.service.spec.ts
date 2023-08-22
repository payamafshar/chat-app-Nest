import { Test, TestingModule } from '@nestjs/testing';
import { FirendsService } from '../firends.service';

describe('FirendsService', () => {
  let service: FirendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirendsService],
    }).compile();

    service = module.get<FirendsService>(FirendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
