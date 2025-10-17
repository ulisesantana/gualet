import { Id } from "@gualet/core";
import { BaseError, ErrorCodes } from "@domain/errors";

export class CategoryNotFoundError extends BaseError {
  readonly code = ErrorCodes.CategoryNotFound;

  constructor(id: Id) {
    super(`Category with id ${id.toString()} not found.`);
    this.name = "CategoryNotFoundError";
  }
}
