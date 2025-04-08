import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OperationType } from '@src/common/domain';
import { DateString } from '@src/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class FindTransactionsCriteria {
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Filter transactions after a given date.',
    required: false,
    example: '2020-01-01',
  })
  from?: DateString;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Filter transactions before a given date.',
    required: false,
    example: '2020-01-01',
  })
  to?: DateString;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter transactions by category.',
    required: false,
    example: 'b692a841-ca0e-40fe-83ba-3883f44c7911',
  })
  categoryId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter transactions by payment method.',
    required: false,
    example: 'b692a841-ca0e-40fe-83ba-3883f44c7911',
  })
  paymentMethodId?: string;

  @IsOptional()
  @IsEnum(OperationType)
  @ApiProperty({
    description: 'Filter transactions by operation type.',
    required: false,
    enum: OperationType,
    example: OperationType.Outcome,
  })
  operation?: OperationType;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiProperty({
    description: 'Sort direction.',
    required: false,
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  sort?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Page number.',
    required: false,
    type: Number,
    example: 1,
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description:
      'Number of transactions per page. If set to 0, all matching transactions will be returned.',
    required: false,
    type: Number,
    example: 10,
  })
  pageSize?: number;
}
