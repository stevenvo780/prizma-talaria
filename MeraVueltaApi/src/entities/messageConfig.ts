import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './users';
import { SharedProp } from './sharedProp.helper';

@Entity()
export class MessageConfig extends SharedProp {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  company: User;

  @Column({ nullable: true })
  messageKey: string;

  @Column({ type: 'text', nullable: true })
  messageText: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;
}