import { BaseError, Id } from '@gualet/shared';
import { CategoriesErrorCodes } from './categories-error-codes.enum';

export class CategoryInUseError extends BaseError<CategoriesErrorCodes> {
  code = CategoriesErrorCodes.CategoryInUse;

  constructor(id: Id) {
    super(`Category ${id.toString()} is in use and cannot be deleted`);
  }
}
