import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TimeString } from '@src/common/types';
import { UserEntity } from './index';

@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @CreateDateColumn()
  createdAt: TimeString;

  @UpdateDateColumn()
  updatedAt: TimeString;
}
