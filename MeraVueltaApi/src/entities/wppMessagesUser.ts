import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SharedProp } from './sharedProp.helper';
import { User } from './users';

@Entity()
export class WppMessagesUser extends SharedProp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  log: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text' })
  to: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
