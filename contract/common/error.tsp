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

model UnauthorizedError extends ProblemDetails {
  @statusCode statusCode: 401;
  ...ProblemDetails;
}

model ForbiddenError extends ProblemDetails {
  @statusCode statusCode: 403;
  ...ProblemDetails;
}

model NotFoundError extends ProblemDetails {
  @statusCode statusCode: 404;
  ...ProblemDetails;
}

model InternalServerError extends ProblemDetails {
  @statusCode statusCode: 500;
  ...ProblemDetails;
}
