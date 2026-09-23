export abstract class BaseError extends Error {
  readonly type?: string;
  abstract readonly title: string;
  abstract readonly status: number;
  readonly detail?: string;
  constructor(detail?: string, type?: string) {
    super(detail);
    if (detail !== undefined) this.detail = detail;
    if (type !== undefined) this.type = type;
  }
}

export class BadRequestError extends BaseError {
  title = "Bad Request";
  status = 400;
}

export class UnauthorizedError extends BaseError {
  title = "Unauthorized";
  status = 401;
}

export class ForbiddenError extends BaseError {
  title = "Forbidden";
  status = 403;
}

export class NotFoundError extends BaseError {
  title = "Not Found";
  status = 404;
}

export class ConflictError extends BaseError {
  title = "Conflict";
  status = 409;
}

export class InternalServerError extends BaseError {
  title = "Internal Server Error";
  status = 500;
}
