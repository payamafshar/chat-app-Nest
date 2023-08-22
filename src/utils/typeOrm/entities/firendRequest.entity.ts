import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequestStatus } from 'src/utils/types';

@Entity({ name: 'firend_requests' })
export class FirendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: UserEntity;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: UserEntity;

  @CreateDateColumn()
  createdAt: number;

  @Column()
  status: FriendRequestStatus;
}
