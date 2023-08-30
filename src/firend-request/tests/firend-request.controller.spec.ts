import { Test, TestingModule } from '@nestjs/testing';
import { FirendRequestController } from '../firend-request.controller';
import { Services } from 'src/utils/constants';
import { IFriendRequestService } from '../firend-request';
import { userMock } from 'src/_mocks/users.mock';

describe('FirendRequestController', () => {
  let controller: FirendRequestController;
  let service: IFriendRequestService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirendRequestController],
      providers: [
        {
          provide: Services.FIREND_REQUEST,
          useValue: {
            getPendingRequest: jest.fn((x) => x),
            create: jest.fn((x) => x),
          },
        },
      ],
    }).compile();

    controller = module.get<FirendRequestController>(FirendRequestController);
    service = module.get<IFriendRequestService>(Services.FIREND_REQUEST);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call firendRequestController.getAllPendingRequest', async () => {
    await controller.getAllPendingRequests(userMock);
    expect(service.getPendingRequest).toBeCalled();
    expect(service.getPendingRequest).toBeCalledWith(userMock.id);
  });

  it('should call firendRequestController.createRequest with params', async () => {
    await controller.createRequest({ receiver: 'testUsername' }, userMock);
    expect(service.create).toBeCalled();
    expect(service.create).toBeCalledWith({
      receiverUsername: 'testUsername',
      sender: userMock,
    });
  });
});
