import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './users';
import { SharedProp } from './sharedProp.helper';

@Entity()
export class WompiLog extends SharedProp {
	@Index()
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text', })
	jsonResponse: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;
}
