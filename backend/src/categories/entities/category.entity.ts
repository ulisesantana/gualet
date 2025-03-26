import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OperationType } from '../../common/types';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({
    enum: OperationType,
    default: OperationType.Outcome,
  })
  type: OperationType;
}
