import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import {
  AuthenticatedSocket,
  IGatewaySessionManager,
} from 'src/utils/interfaces';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { CreateMessageResponse } from 'src/utils/types';

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
  ) {}

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    this.sessions.setUserSocket(socket.user.id, socket);

    socket.emit('connected', { status: 'connnected' });
    console.log(this.sessions);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('createMesssage');
  }

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
}
