import { SuccessResponse } from '@src/common/infrastructure';

export class DeleteTransactionResponseDto extends SuccessResponse<null> {
  constructor() {
    super(null);
  }
}
