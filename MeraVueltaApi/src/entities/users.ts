import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/** Available roles for the users */
export enum UserRoleOptions {
  COMPANY = 'company',
  DOMICILIARY = 'domiciliary',
  ADMIN = 'admin',
}

import { SharedProp } from './sharedProp.helper';
@Entity()
export class User extends SharedProp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  bornDate: string;

  @Column()
  typeDocument: string;

  @Column({ unique: true })
  documentNumber: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ nullable: true })
  prefix: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  googleSheets: string;

  @Column({ nullable: true })
  urlPush: string;

  @Column({ nullable: true })
  confirmEmail: boolean;

  // Token for email
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  token: string;

  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  auth_token: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;
}