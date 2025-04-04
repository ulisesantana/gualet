import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OperationType } from '@src/common/domain';
import { DateString } from '@src/common/types';

export class FindTransactionsCriteria {
  @IsOptional()
  @IsString()
  from?: DateString;

  @IsOptional()
  @IsString()
  to?: DateString;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsEnum(OperationType)
  operation?: OperationType;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
