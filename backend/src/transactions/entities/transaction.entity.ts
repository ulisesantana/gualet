import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationType } from '@src/common/domain';
import { TimeString } from '@src/common/types';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  category_id: string;

  @Column()
  payment_method_id: string;

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
