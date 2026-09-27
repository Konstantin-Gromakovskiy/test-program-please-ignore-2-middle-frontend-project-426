using Http;

namespace Error;

@error
model ProblemDetails {
  @header("Content-Type") contentType: "application/problem+json";
  type?: url;
  title: string;
  detail?: string;
  instance?: url;
}

model BadRequestError extends ProblemDetails {
  @statusCode statusCode: 400;
  status: 400;
}

model UnauthorizedError extends ProblemDetails {
  @statusCode statusCode: 401;
  status: 401;
}

model ForbiddenError extends ProblemDetails {
  @statusCode statusCode: 403;
  status: 403;
}

model NotFoundError extends ProblemDetails {
  @statusCode statusCode: 404;
  status: 404;
}

model ConflictError extends ProblemDetails {
  @statusCode statusCode: 409;
  status: 409;
}

model InternalServerError extends ProblemDetails {
  @statusCode statusCode: 500;
  status: 500;
}
