import { BaseResponse } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';

export class DeleteTransactionResponseDto extends BaseResponse<null, unknown> {
  constructor(error: Nullable<unknown> = null) {
    super(null, error);
  }
}
