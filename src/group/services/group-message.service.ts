import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IGroupMessageService, IGroupService } from '../group';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import {
  CreateGroupMessageParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from 'src/utils/types';
import { Repositories, Services } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @Inject(Repositories.GROUP_MESSAGE)
    private readonly groupMessageRepository: Repository<GroupMessageEntity>,
    @Inject(Repositories.GROUP)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async createGroupMessage(params: CreateGroupMessageParams) {
    const { groupId, content, author } = params;

    const findedGroup = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users', 'lastMessageSent'],
    });

    if (!findedGroup) throw new NotFoundException('group not found');

    const existUser = findedGroup.users.find((user) => user.id == author.id);

    if (!existUser)
      throw new BadRequestException('you are not exist in this group');

    const groupMessageInstance = this.groupMessageRepository.create({
      content,
      author,
      group: findedGroup,
    });

    const savedGroupMessage = await this.groupMessageRepository.save(
      groupMessageInstance,
    );

    findedGroup.lastMessageSent = savedGroupMessage;

    const updatedGroup = await this.groupRepository.save(findedGroup);
    return {
      message: savedGroupMessage,
      group: updatedGroup,
    };
  }

  async getAllGroupMessages(groupId: number): Promise<GroupMessageEntity[]> {
    return await this.groupMessageRepository.find({
      where: { group: { id: groupId } },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteGroupMessage(params: DeleteGroupMessageParams) {
    const group = await this.groupRepository
      .createQueryBuilder('groups')
      .where('groups.id = :groupId', { groupId: params.groupId })
      .leftJoinAndSelect('groups.owner', 'owner')
      .leftJoinAndSelect('groups.messages', 'messages')
      .leftJoinAndSelect('groups.lastMessageSent', 'lastMessageSent')
      .orderBy('messages.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!group) throw new NotFoundException('group not found');
    const foundedMessage = await this.groupMessageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
        group: { id: params.groupId },
      },
    });

    if (!foundedMessage) throw new NotFoundException('message Not Found');

    if (foundedMessage.id != group.lastMessageSent.id) {
      return this.groupMessageRepository.delete({ id: foundedMessage.id });
    }

    return this.deleteLastMessageFromGroup(group, foundedMessage);
  }

  async deleteLastMessageFromGroup(
    group: GroupEntity,
    message: GroupMessageEntity,
  ) {
    const size = group.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.groupRepository.update(
        {
          id: group.id,
        },
        { lastMessageSent: null },
      );
      return this.groupMessageRepository.delete({
        id: message.id,
      });
      //deleteing group when exist one message and user deleting that message group removed also double check
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = group.messages[SECOND_MESSAGE_INDEX];
      await this.groupRepository.update(
        {
          id: group.id,
        },
        {
          lastMessageSent: newLastMessage,
        },
      );
      return this.groupMessageRepository.delete({ id: message.id });
    }
  }

  async editGroupMessage(
    params: EditGroupMessageParams,
  ): Promise<GroupMessageEntity> {
    const { groupId, messageId, user, content } = params;

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['lastMessageSent'],
    });
    const findedMessage = await this.groupMessageRepository.findOne({
      where: { id: messageId, author: { id: user.id } },
    });

    if (!findedMessage) throw new NotFoundException('Can not edit Message');

    findedMessage.content = content;
    findedMessage.group = group;
    findedMessage.author = user;
    const updatedGroupMessage = await this.groupMessageRepository.save(
      findedMessage,
    );

    if (findedMessage.id == group.lastMessageSent.id)
      this.groupRepository.update(
        { id: groupId },
        { lastMessageSent: updatedGroupMessage },
      );

    return updatedGroupMessage;
  }
}
