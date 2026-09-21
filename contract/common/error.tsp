using Http;

namespace Error;

@error
model ProblemDetails {
  @header("Content-Type") contentType: "application/problem+json";
  type?: url;
  title: string;
  status: int32;
  detail?: string;
  instance?: url;
}

model BadRequestError extends ProblemDetails {
  @statusCode statusCode: 400;
}

model UnauthorizedError extends ProblemDetails {
  @statusCode statusCode: 401;
}

model ForbiddenError extends ProblemDetails {
  @statusCode statusCode: 403;
}

model NotFoundError extends ProblemDetails {
  @statusCode statusCode: 404;
}

model ConflictError extends ProblemDetails {
  @statusCode statusCode: 409;
}

model InternalServerError extends ProblemDetails {
  @statusCode statusCode: 500;
}
