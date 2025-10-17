import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export function Required<T>(example?: T) {
  return applyDecorators(
    ApiProperty({ required: true, example }),
    IsNotEmpty(),
  );
}
