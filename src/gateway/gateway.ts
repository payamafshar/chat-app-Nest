import { Inject, BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IConversationService } from 'src/conversation/coversation';
import { IGroupService } from 'src/group/group';
import { Repositories, Services } from 'src/utils/constants';
import {
  AuthenticatedSocket,
  IGatewaySessionManager,
} from 'src/utils/interfaces';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import {
  AddUserToGroupEventPayload,
  CreateMessageResponse,
  DeleteGroupMessageEventPayload,
  DeleteMessagePayload,
  DeleteRecipientFromGroupEventPayload,
  GroupMessageEventPayload,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
    @Inject(Repositories.CONVERSATION)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @Inject(Services.GROUP) private readonly groupService: IGroupService,
  ) {}

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    this.sessions.setUserSocket(socket.user.id, socket);

    console.log(socket.user.id);
    socket.emit('connected', { status: 'connnected' });
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getOnlineGroupUsers')
  async handleGetOnlineGroupUsers(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const group = await this.groupService.findGroupById(parseInt(data.groupId));
    if (!group) return;
    const onlineUsers = [];
    const offlineUsers = [];
    group.users.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.id);
      socket ? onlineUsers.push(user) : offlineUsers.push(user);
    });
    socket.emit('onlineGroupUsersReceived', { onlineUsers, offlineUsers });
  }
  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('createMesssage');
  }
  @SubscribeMessage('onConversationJoin')
  onConversationConnect(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    console.log('User Connected');

    client.join(`conversation-${data.conversationId}`);

    client.to(`conversation-${data.conversationId}`).emit('userJoin');
  }

  @SubscribeMessage('onGroupJoin')
  handleGroupJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    client.join(`group-${data.groupId}`);

    client.to(`group-${data.groupId}`).emit('userGroupJoin');
  }

  @SubscribeMessage('onGroupLeave')
  handleGroupLeave(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    client.leave(`group-${data.groupId}`);

    client.to(`group-${data.groupId}`).emit('userGroupLeave');
  }

  @SubscribeMessage('onConversationLeave')
  onConversatiuonLeaves(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    console.log('User disconnected');

    console.log(data);
    client.leave(`conversation-${data.conversationId}`);

    client.to(`conversation-${data.conversationId}`).emit('userLeave');
  }
  @SubscribeMessage('onUpdateGroupMessage')
  handleUpdateWithId(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    const { userId } = data;
  }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    console.log(data);
    // set all users connected to room exept himself
    // this code sent recipient typing status
    client.to(`conversation-${data.conversationId}`).emit('userStartTyping');
  }
  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    // set all users connected to room exept himself
    // this code sent recipient typing status
    client.to(`conversation-${data.conversationId}`).emit('userStopTyping');
  }
  //Conversation Events ------------------------------------------
  @OnEvent('create.message')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    console.log('inside the message event');
    const {
      author,
      conversation: { creator, recipient },
    } = payload.message;

    // for not emit to every single connected user with server.emit('onMessage',payload)
    const authorSocket = this.sessions.getUserSocket(author.id);
    const recipientSocket =
      author.id == creator.id
        ? this.sessions.getUserSocket(recipient.id) // recipient is recipient.id socket must emit from this socket
        : this.sessions.getUserSocket(creator.id); // recipient is  creator.id and must emit from this socket

    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }
  //this event emited beacus for recipient conversation created shows on sidebar need socket but create conversation for own side handled in front end redux store
  @OnEvent('conversation.created')
  handleCreateConversation(payload: ConversationEntity) {
    const { recipient } = payload;

    const recipientSocket = this.sessions.getUserSocket(recipient.id);

    if (recipientSocket) recipientSocket.emit('onConversationCreate', payload);
  }

  @OnEvent('message.delete')
  async handleDeleteMessage(payload: DeleteMessagePayload) {
    const { conversationId, messageId, userId } = payload;

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['creator', 'recipient'],
    });

    const { creator, recipient } = conversation;

    const recipientSocket =
      creator.id == userId
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);

    if (recipientSocket) recipientSocket.emit('onDeleteMessage', payload);
  }

  @OnEvent('message.edit')
  async handleEditMessage(payload: MessageEntity) {
    const { creator, recipient } = payload.conversation;

    const recipientSocket =
      creator.id == payload.author.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);

    if (recipientSocket) recipientSocket.emit('onEditMessage', payload);
  }
  //Group Events --------------------------------
  @OnEvent('group.created')
  async handleCreateGroup(payload: GroupEntity) {
    payload.users.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.id);
      socket && socket.emit('onGroupCreate', payload);
    });
  }

  @OnEvent('groupMessage.created')
  async handleCreateGroupMessage(payload: GroupMessageEventPayload) {
    const {
      group: { id: groupId, users },
      message: { author },
    } = payload;
    //delete becuse recive new message in all over application not in room just
    // this.server.to(`group-${groupId}`).emit('onGroupMessageCreate', payload);

    this.server.emit('onGroup', payload);
  }

  @OnEvent('groupMessage.delete')
  async handleDeleteGroupMessage(payload: DeleteGroupMessageEventPayload) {
    const { messageId, groupId, userId } = payload;

    const socket = this.sessions.getUserSocket(userId);
    //doing this beacus author side deleting handled by thunk function redux and if we do not this cuz ERROR
    socket.to(`group-${groupId}`).emit('onDeleteGroupMessage', payload);
  }

  @OnEvent('groupMessage.update')
  async handleUpdateGroupMessage(payload: GroupMessageEntity) {
    const {
      group: { id: groupId },
      author: { id: authorId },
    } = payload;
    const authorSocket = this.sessions.getUserSocket(authorId);
    if (!authorSocket) throw new BadRequestException();
    //also can do with server.emit !!!
    authorSocket.to(`group-${groupId}`).emit('onUpdateGroupMessage', payload);
    // this.server.to(`group-${groupId}`).emit('onUpdateGroupMessage', payload);
  }

  @OnEvent('recipient.added')
  async handleAddUserToGroup(payload: AddUserToGroupEventPayload) {
    const {
      recipientId,
      group: {
        id: groupId,
        creator: { id: creatorId },
        owner: { id: ownerId },
      },
    } = payload;

    const creatorSocket = this.sessions.getUserSocket(creatorId);
    const ownerSocket = this.sessions.getUserSocket(ownerId);
    const recipientSocket = this.sessions.getUserSocket(recipientId);
    console.log(recipientSocket);
    // if (creatorId == ownerId) {
    //   creatorSocket &&
    //     creatorSocket.to(`group-${groupId}`).emit('onUserAddedGroup', payload);
    // } else {
    //   creatorSocket &&
    //     creatorSocket.to(`group-${groupId}`).emit('onUserAddedGroup', payload);
    //   ownerSocket &&
    //     ownerSocket.to(`group-${groupId}`).emit('onUserAddedGroup', payload);
    // }
    this.server.to(`group-${groupId}`).emit('onUserAddedGroup', payload);

    recipientSocket &&
      recipientSocket.emit('recipientAddedGroup', payload.group);
  }

  @OnEvent('recipient.deleted')
  async handleDeleteRecipientFromGroup(
    payload: DeleteRecipientFromGroupEventPayload,
  ) {
    const {
      recipientId,
      group: {
        id: groupId,
        creator: { id: creatorId },
        owner: { id: ownerId },
      },
    } = payload;
    const ROOM_NAME = `group-${groupId}`;
    const removedUserSocket = this.sessions.getUserSocket(recipientId);
    const creatorSocket = this.sessions.getUserSocket(creatorId);
    const ownerSocket = this.sessions.getUserSocket(ownerId);
    if (removedUserSocket) {
      removedUserSocket.emit('onGroupRemovedRecipient', payload);
      removedUserSocket.leave(ROOM_NAME);
    }
    this.server.to(ROOM_NAME).emit('onUserDeletetFromGroup', payload);
    //   const onlineUsers = group.users
    //   .map((user) => this.sessions.getUserSocket(user.id) && user)
    //   .filter((user) => user);
    // this.server.to(ROOM_NAME).emit('onlineGroupUsersReceived', { onlineUsers });
  }
}
