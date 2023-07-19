import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MessageEntity } from './messages.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  password: string;

  @Column()
  @Exclude()
  lastName: string;

  @OneToMany(() => MessageEntity, (message) => message.author)
  @JoinColumn()
  messages: MessageEntity[];
}
