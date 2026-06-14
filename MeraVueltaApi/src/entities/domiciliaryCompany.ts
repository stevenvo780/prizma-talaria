import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './users';
import { SharedProp } from './sharedProp.helper';

export enum statusOrder {
  WAIT_DISPATCH = 'EsperaDespacho',
  WAIT_EXIT = 'EsperaSalida',
  EXIT = 'Salida',
  DELIVERED = 'Entregada',
}

/** Entity in charge of storing all the created events */
@Entity()
export class DomiciliaryCompany extends SharedProp {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
	@JoinColumn({ name: 'companyId' })
	company: User;

  @ManyToOne(() => User)
	@JoinColumn({ name: 'domiciliaryId' })
	domiciliary: User;
}
