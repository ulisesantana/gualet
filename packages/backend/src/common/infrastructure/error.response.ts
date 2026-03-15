import { BaseResponse } from '../infrastructure';

export class ErrorResponse<TypeError = string> extends BaseResponse<
  null,
  TypeError
> {
  constructor(error: TypeError) {
    super(null, error);
  }
}
