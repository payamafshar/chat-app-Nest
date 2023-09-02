import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from '../conversation.service';
import { IConversationService } from '../coversation';
import { Repositories, Services } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { IUsersService } from 'src/users/users';
import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { userMock } from 'src/_mocks/users.mock';
import {
  conversationMock,
  conversationMockWithOutMessage,
} from 'src/_mocks/conversation.mock';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
const messageMock = {
  content: 'yead',
  author: { id: 21321, username: 'testUsername' } as UserEntity,
  conversation: {
    creator: { id: 21321, username: 'testUsername' } as UserEntity,
    recipient: { id: 7, username: 'tesfaa' } as UserEntity,
  } as ConversationEntity,
} as unknown as MessageEntity;
describe('ConversationService', () => {
  let conversationService: IConversationService;
  let conversationRepository: Repository<ConversationEntity>;
  let usersService: IUsersService;
  let messageRepository: Repository<MessageEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Services.CONVERSATION,
          useClass: ConversationService,
        },
        {
          provide: Repositories.CONVERSATION,
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockReturnValue({}),
          },
        },
        {
          provide: Services.USERS,
          useValue: {
            findUser: jest.fn().mockReturnValue({}),
          },
        },
        {
          provide: Repositories.MESSAGE,
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    conversationService = module.get<IConversationService>(
      Services.CONVERSATION,
    );
    conversationRepository = module.get(Repositories.CONVERSATION);
    usersService = module.get<IUsersService>(Services.USERS);
    messageRepository = module.get(Repositories.MESSAGE);
  });

  it('should be defined', () => {
    expect(conversationService).toBeDefined();
  });

  describe('createConversation', () => {
    it('should call createConversation ', async () => {
      const recipientMock = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({ username: 'payam1' } as UserEntity),
        );

      const user = await usersService.findUser({ username: 'payam1' });
      expect(user).toBeDefined();
    });
    it('should throw error when recipient not found', async () => {
      jest
        .spyOn(usersService, 'findUser')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(
        conversationService.createConversation(userMock, { username: 'hello' }),
      ).rejects.toThrowError();
    });
    it('should compare recipientId and creatorId if its equal throw error', async () => {
      jest
        .spyOn(usersService, 'findUser')
        .mockImplementationOnce(() => Promise.resolve(userMock));
      expect(
        conversationService.createConversation(userMock, {
          username: userMock.username,
        }),
      ).rejects.toThrowError();
    });
    it('should throw error if conversation exists between recipient and creator', async () => {
      jest
        .spyOn(conversationService, 'isCreated')
        .mockImplementationOnce(() => Promise.resolve(conversationMock));
      expect(
        conversationService.createConversation(userMock, {
          username: conversationMock.recipient.username,
        }),
      ).rejects.toThrowError();
    });

    it('should save Conversation betweeen creator and recipient', async () => {
      jest
        .spyOn(usersService, 'findUser')
        .mockImplementation(() =>
          Promise.resolve(conversationMock.recipient as UserEntity),
        );
      jest.spyOn(conversationService, 'isCreated').mockResolvedValueOnce(false);
      const mockConversation: ConversationEntity = {
        creator: userMock,
        recipient: conversationMock.recipient as UserEntity,
      } as ConversationEntity;
      jest
        .spyOn(conversationRepository, 'create')
        .mockReturnValue(mockConversation);
      jest
        .spyOn(conversationRepository, 'save')
        .mockResolvedValueOnce(mockConversation);
      await conversationService.createConversation(userMock, {
        username: conversationMock.recipient.username,
      } as UserEntity);
      expect(conversationRepository.save).toBeCalledWith(mockConversation);
    });
    it.only('should create a conversation with a message', async () => {
      const recipientMock = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ id: 7, username: 'tesfaa' } as UserEntity),
        );
      jest.spyOn(conversationService, 'isCreated').mockResolvedValue(false);

      jest.spyOn(conversationRepository, 'create').mockReturnValue({
        creator: { id: 21321, username: 'testUsername' } as UserEntity,
        recipient: { id: 7, username: 'tesfaa' } as UserEntity,
      } as ConversationEntity);

      jest.spyOn(conversationRepository, 'save').mockImplementation(() =>
        Promise.resolve({
          creator: { id: 21321, username: 'testUsername' } as UserEntity,
          recipient: { id: 7, username: 'tesfaa' } as UserEntity,
          lastMessageSent: {
            content: 'yead',
            author: { username: 'testUsername' } as UserEntity,
          } as MessageEntity,
        } as ConversationEntity),
      );
      jest
        .spyOn(messageRepository, 'create')
        .mockImplementationOnce(() => messageMock);
      jest
        .spyOn(messageRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(messageMock));

      const result = await conversationService.createConversation(
        messageMock.author as UserEntity,
        {
          username: 'tesfaa',
          message: messageMock.content,
        },
      );

      console.log(result);
      expect(conversationRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.creator).toEqual(messageMock.author);
      expect(messageRepository.save).toHaveBeenCalledWith(messageMock);
    });
  });
});
