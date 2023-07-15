import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  fistName: string;

  @Column()
  password: string;

  @Column()
  @Exclude()
  lastName: string;
}
