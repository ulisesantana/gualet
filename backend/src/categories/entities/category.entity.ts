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
import { DateString } from '@src/common/types';
import { UserEntity } from '@src/users';

@Entity('categories')
export class CategoryEntity {
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

  @Column({
    enum: OperationType,
    default: OperationType.Outcome,
  })
  type: OperationType;

  @CreateDateColumn()
  createdAt: DateString;

  @UpdateDateColumn()
  updatedAt: DateString;
}
