import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from './base-entity-abstract';
import { GroupEntity } from './group.entity';

@Entity({ name: 'group_messages' })
export class GroupMessageEntity extends BaseMessage {
  @ManyToOne(() => GroupEntity, (group) => group.messages)
  group: GroupEntity;
}
