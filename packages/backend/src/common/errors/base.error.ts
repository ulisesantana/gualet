export abstract class BaseError<ErrorCodes> extends Error {
  abstract code: ErrorCodes;
}
