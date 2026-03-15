import { BaseError, Id } from '@gualet/shared';
import { CategoriesErrorCodes } from './categories-error-codes.enum';

export class CategoryNotFoundError extends BaseError<CategoriesErrorCodes> {
  code = CategoriesErrorCodes.CategoryNotFound;

  constructor(id: Id) {
    super(`Category with id "${id.toString()}" not found.`);
  }
}
