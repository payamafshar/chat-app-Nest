import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './messages.entity';

@Entity({ name: 'conversations' })
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: UserEntity;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.conversation, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  messages: MessageEntity[];

  @OneToOne(() => MessageEntity, { cascade: ['update', 'insert'] })
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: MessageEntity;
}
