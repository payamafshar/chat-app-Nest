import { Test, TestingModule } from '@nestjs/testing';
import { FirendRequestService } from '../firend-request.service';
import { IFriendRequestService } from '../firend-request';
import { Repositories, Services } from 'src/utils/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FirendRequestEntity } from 'src/utils/typeOrm/entities/firendRequest.entity';
import { FriendEntity } from 'src/utils/typeOrm/entities/firends.entity';
import { IUsersService } from 'src/users/users';
import { IFirendService } from 'src/firends/firends';
import { Repository } from 'typeorm';
import { Module } from 'module';
import { NotFoundException } from '@nestjs/common';

describe('FirendRequestService', () => {
  let firendRequestService: IFriendRequestService;
  let usersService: IUsersService;
  let firendsService: IFirendService;
  let firendRequestRepository: Repository<FirendRequestEntity>;
  let firendRepository: Repository<FriendEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Services.FIREND_REQUEST,
          useClass: FirendRequestService,
        },
        {
          provide: Services.USERS,
          useValue: {},
        },
        {
          provide: Services.FIRENDS,
          useValue: {},
        },
        {
          provide: Repositories.FIREND_REQUEST,
          useValue: {
            find: jest.fn((x) => x),
            delete: jest.fn((x) => x),
          },
        },
        {
          provide: Repositories.FIRENDS,
          useValue: {},
        },
      ],
    }).compile();

    firendRequestService = module.get<IFriendRequestService>(
      Services.FIREND_REQUEST,
    );
    usersService = module.get<IUsersService>(Services.USERS);
    firendsService = module.get<IFirendService>(Services.FIRENDS);
    firendRequestRepository = module.get(Repositories.FIREND_REQUEST);
    firendRepository = module.get(Repositories.FIRENDS);
  });

  it('should be defined', () => {
    expect(firendRequestService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(firendsService).toBeDefined();
    expect(firendRequestRepository).toBeDefined();
    expect(firendRepository).toBeDefined();
  });
  it('should call getPendingRequest', async () => {
    await firendRequestService.getPendingRequest(30);
    expect(firendRequestRepository.find).toHaveBeenCalledWith({
      where: [
        {
          sender: { id: 30 },
          status: 'pending',
        },
        {
          receiver: { id: 30 },
          status: 'pending',
        },
      ],
      relations: ['receiver', 'sender'],
    });
  });
  describe('firendRequestService.cancel', () => {
    it('should not found firend Request', async () => {
      jest
        .spyOn(firendRequestService, 'findById')
        .mockImplementationOnce(() => Promise.resolve(undefined));
      expect(
        firendRequestService.cancelFirendRequest({ reqId: 30, receiverId: 40 }),
      ).rejects.toThrowError(NotFoundException);
    });
    it('should be throw error when sender.id not equal to userId', async () => {
      jest.spyOn(firendRequestService, 'findById').mockImplementationOnce(() =>
        Promise.resolve({
          id: 30,
          sender: { id: 40 },
        } as FirendRequestEntity),
      );
      expect(
        firendRequestService.cancelFirendRequest({ reqId: 30, receiverId: 40 }),
      ).rejects.toThrowError(NotFoundException);
    });
    it('should not be throw errror when calling firendRequestRepository.delete', async () => {
      jest.spyOn(firendRequestService, 'findById').mockImplementationOnce(() =>
        Promise.resolve({
          id: 30,
          sender: { id: 40 },
        } as FirendRequestEntity),
      );
      await firendRequestService.cancelFirendRequest({
        reqId: 30,
        receiverId: 40,
      });
      expect(firendRequestRepository.delete).toHaveBeenCalledWith(30);
    });
  });
});
