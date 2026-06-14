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
export class Wompi extends SharedProp {
	@Index()
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	tokenPay: string;

	@Column({ type: 'text', default: '' })
	transactionId: string;

	@Column({ type: 'text', default: '' })
	dataUser: string;

	@Column({ default: 'free' })
	plan: string;

	@Column({ default: 'PENDING' })
	status: string;

	@Column( { default: false } )
	valid: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;
}
