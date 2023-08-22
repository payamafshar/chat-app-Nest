import { Test, TestingModule } from '@nestjs/testing';
import { FirendRequestController } from '../firend-request.controller';

describe('FirendRequestController', () => {
  let controller: FirendRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirendRequestController],
    }).compile();

    controller = module.get<FirendRequestController>(FirendRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
