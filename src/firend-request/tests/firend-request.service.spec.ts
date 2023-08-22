import { Test, TestingModule } from '@nestjs/testing';
import { FirendRequestService } from '../firend-request.service';

describe('FirendRequestService', () => {
  let service: FirendRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirendRequestService],
    }).compile();

    service = module.get<FirendRequestService>(FirendRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
