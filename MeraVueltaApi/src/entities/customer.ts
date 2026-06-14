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
export class Customer extends SharedProp {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => User)
  @JoinColumn()
  company: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  typeDocument: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  prefix: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column({ nullable: true })
  residentialGroupName: string;

  @Column({ nullable: true })
  houseNumberOrApartment: string;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  geolocationDelivery: string;

  @Column({ nullable: true })
  zone: string;
}
