import "./models.tsp";
import "../common/error.tsp";
import "../common/sessionAuth.tsp";
import "@typespec/http";

using Http;
using OpenAPI;

@doc("Авторизация пользователя")
@route("auth")
@tag("Auth")
namespace Main.Auth;

@post
@route("login")
@operationId("login")
op login(@body body: Credentials):
  | {
      @statusCode statusCode: 200;
      @header("Set-Cookie") setCookie: string;

      @body
      body: UserDto;
    }
  | Error.UnauthorizedError
  | Error.BadRequestError;

@useAuth(SessionAuth)
@post
@route("logout")
@operationId("logout")
op logout():
  | {
      @header("Set-Cookie")
      setCookie: "sessions=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";

      @statusCode statusCode: 204;
    }
  | Error.UnauthorizedError;

@useAuth(SessionAuth)
@get
@route("me")
@operationId("me")
op me():
  | {
      @statusCode statusCode: 200;

      @body
      body: UserDto;
    }
  | Error.UnauthorizedError;

@post
@route("register")
@operationId("register")
op register(@body body: Credentials):
  | {
      @statusCode statusCode: 201;
      @header("Set-Cookie") setCookie: string;

      @body
      body: UserDto;
    }
  | Error.ConflictError
  | Error.BadRequestError;
