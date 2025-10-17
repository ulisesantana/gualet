import { BaseError } from '@src/common/errors';
import { CategoriesErrorCodes } from './categories-error-codes.enum';
import { Id } from '@src/common/domain';

export class NotAuthorizedForCategoryError extends BaseError<CategoriesErrorCodes> {
  code = CategoriesErrorCodes.NotAuthorizedForCategory;

  constructor(id: Id) {
    super(`Not authorized for category with id "${id.toString()}".`);
  }
}
