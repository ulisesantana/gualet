import { BaseResponse, Pagination } from '../infrastructure';
import { Nullable } from '@gualet/shared';

export class SuccessResponse<Data = string> extends BaseResponse<Data, null> {
  constructor(data: Data, pagination: Nullable<Pagination> = null) {
    super(data, null, pagination);
  }
}
