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
import { UserEntity } from './user.entity';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity('user_preferences')
export class UserPreferencesEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column('uuid')
  defaultPaymentMethodId: string;

  @ManyToOne(() => PaymentMethodEntity)
  @JoinColumn({ name: 'defaultPaymentMethodId' })
  defaultPaymentMethod: PaymentMethodEntity;

  @CreateDateColumn()
  createdAt: TimeString;

  @UpdateDateColumn()
  updatedAt: TimeString;
}
