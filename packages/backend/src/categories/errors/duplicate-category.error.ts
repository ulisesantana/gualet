import { ConflictException } from '@nestjs/common';
import { CategoriesErrorCodes } from './categories-error-codes.enum';

export class DuplicateCategoryError extends ConflictException {
  constructor(name: string) {
    super({
      code: CategoriesErrorCodes.DuplicateCategory,
      message: `Category with name "${name}" already exists`,
    });
  }
}
