import { ErrorCodes } from "@domain/errors";

export abstract class BaseError extends Error {
  abstract code: ErrorCodes;
}
