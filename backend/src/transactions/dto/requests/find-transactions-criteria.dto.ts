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
  from?: DateString;

  @IsOptional()
  @IsDateString()
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
  @ApiProperty({
    description:
      'Number of transactions per page. If set to -1, all matching transactions will be returned.',
    required: false,
    type: Number,
    example: 10,
  })
  pageSize?: number;
}
