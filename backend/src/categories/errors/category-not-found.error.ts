import { BaseError } from '@src/common/errors';
import { Id } from '@src/common/domain';
import { CategoriesErrorCodes } from './categories-error-codes.enum';

export class CategoryNotFoundError extends BaseError<CategoriesErrorCodes> {
  code = CategoriesErrorCodes.CategoryNotFound;

  constructor(id: Id) {
    super(`Category with id "${id.toString()}" not found.`);
  }
}
