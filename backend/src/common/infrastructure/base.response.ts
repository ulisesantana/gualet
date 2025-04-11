import { Nullable } from '../types';
import { Pagination } from '../infrastructure';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse<Data, Error = string> {
  @ApiProperty()
  readonly success: boolean;
  @ApiProperty()
  readonly data: Nullable<Data>;
  @ApiProperty()
  readonly error: Nullable<Error>;
  @ApiProperty()
  readonly pagination: Nullable<Pagination>;

  protected constructor(
    data: Nullable<Data> = null,
    error: Nullable<Error> = null,
    pagination: Nullable<Pagination> = null,
  ) {
    this.success = !error;
    this.data = data;
    this.error = error;
    this.pagination = pagination;
  }
}
