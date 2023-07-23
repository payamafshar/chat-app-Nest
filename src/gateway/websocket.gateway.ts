import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('createMesssage');
  }

  @OnEvent('create.message')
  handleMessageCreateEvent(payload: any) {
    console.log('inside the message event');
    console.log(payload);
    this.server.emit('onMessage', payload);
  }
}
