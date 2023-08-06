import { Entity, ManyToOne } from 'typeorm';
import { ConversationEntity } from './conversations.entity';
import { BaseMessage } from './base-entity-abstract';

@Entity({ name: 'messages' })
export class MessageEntity extends BaseMessage {
  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  conversation: ConversationEntity;
}
