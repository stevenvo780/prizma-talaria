import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

export class SharedProp {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}