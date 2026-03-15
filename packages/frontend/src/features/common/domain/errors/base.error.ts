import { ErrorCodes } from "@common/domain/errors";

export abstract class BaseError extends Error {
  abstract code: ErrorCodes;
}
