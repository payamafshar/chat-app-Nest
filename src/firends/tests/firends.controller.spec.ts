import { Test, TestingModule } from '@nestjs/testing';
import { FirendsController } from '../firends.controller';

describe('FirendsController', () => {
  let controller: FirendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirendsController],
    }).compile();

    controller = module.get<FirendsController>(FirendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
