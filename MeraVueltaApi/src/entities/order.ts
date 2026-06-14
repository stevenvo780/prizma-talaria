import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './users';

export enum statusOrder {
  BUYS = 'Compra',
  WAIT_DISPATCH = 'EsperaDespacho',
  WAIT_EXIT = 'EsperaSalida',
  AGREE = 'Aceptada',
  EXIT = 'Salida',
  DELIVERED = 'Entregada',
}
import { SharedProp } from './sharedProp.helper';

@Entity()
export class Order extends SharedProp {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: number;

  @Column({ type: 'bigint', unique: true })
  deliveryNumber: number;

  @Column({ type: 'bigint' })
  purchaseNumber: number;

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
  creationDate: Date;

  @Column({ nullable: true })
  prefix: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ nullable: true })
  pickupAddress: string;

  @Column({ nullable: true })
  pickupLocation: string;

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
  deliveryNote: string;

  @Column({ nullable: true })
  deliveryPacket: string;

  @Column({ nullable: true })
  orderState: string;

  @Column({ nullable: true })
  pickupTime: string;

  @Column({ nullable: true })
  pickupPicture: string;

  @Column({ nullable: true })
  dealerNote: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'domiciliaryId' })
  domiciliary: User | null;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  geolocationDelivery: string;

  @Column({ default: false, nullable: true })
  isDelete: boolean;

  @Column({ nullable: true })
  zone: string;

  @Column({ nullable: true })
  pickupTimeSlot: string;
}
