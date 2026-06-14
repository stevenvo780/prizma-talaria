import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SharedProp } from './sharedProp.helper';

@Entity()
export class PositionUser extends SharedProp {
	@Index()
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	position: string;

	@Column()
	user: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
