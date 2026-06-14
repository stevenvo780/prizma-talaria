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

export enum statusRequest {
  AGREE = 'agree',
  REFUSED = 'refused',
  PENDING = 'pending',
}

/** Entity in charge of storing all the created events */
@Entity()
export class DomiciliaryCompanyRequest extends SharedProp {
  @Index()
  @PrimaryGeneratedColumn('uuid')
	id: string;

  @ManyToOne(() => User)
	@JoinColumn({ name: 'companyId' })
	company: User;

  @ManyToOne(() => User)
	@JoinColumn({ name: 'domiciliaryId' })
	domiciliary: User;

  @Column()
  state: string;
}
