import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IConversationService } from 'src/conversation/coversation';
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
  CreateMessageResponse,
  DeleteMessagePayload,
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
  ) {}

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    this.sessions.setUserSocket(socket.user.id, socket);

    socket.emit('connected', { status: 'connnected' });
  }

  @WebSocketServer()
  server: Server;

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

    console.log(data);
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
    const { id } = payload.group;
    console.log(payload);
    this.server.to(`group-${id}`).emit('onGroupMessageCreate', payload);
  }
}
