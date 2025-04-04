import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateString } from '@src/common/types';
import { UserEntity } from '@src/users';

@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @CreateDateColumn()
  createdAt: DateString;

  @UpdateDateColumn()
  updatedAt: DateString;
}
