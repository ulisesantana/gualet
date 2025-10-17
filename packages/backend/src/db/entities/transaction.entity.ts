import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationType } from '@src/common/domain';
import { TimeString } from '@src/common/types';
import { CategoryEntity, PaymentMethodEntity, UserEntity } from './index';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn()
  category: CategoryEntity;

  @ManyToOne(() => PaymentMethodEntity)
  @JoinColumn()
  payment_method: PaymentMethodEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true, default: '' })
  description: string;

  @Column({
    enum: OperationType,
    default: OperationType.Outcome,
  })
  operation: OperationType;

  @Column('timestamp')
  date: TimeString;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: TimeString;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: TimeString;
}
