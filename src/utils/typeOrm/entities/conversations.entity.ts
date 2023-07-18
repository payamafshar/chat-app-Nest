import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'conversations' })
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: UserEntity;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: UserEntity;
}
