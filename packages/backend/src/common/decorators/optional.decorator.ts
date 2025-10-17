import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export function Optional<T>(example?: T) {
  return applyDecorators(
    ApiProperty({ required: false, example }),
    IsOptional(),
  );
}
