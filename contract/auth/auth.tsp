import "./models.tsp";
import "../common/error.tsp";
import "../common/sessionAuth.tsp";
import "@typespec/http";

using Http;

@doc("Авторизация пользователя")
@route("auth")
@tag("Auth")
namespace Main.Auth;

@post
@route("login")
op login(@body body: LoginParams):
  | {
      @statusCode statusCode: 200;

      @body
      body: UserDto;
    }
  | Error.UnauthorizedError;

@useAuth(SessionAutha)
@post
@route("logout")
op logout(): {
  @statusCode statusCode: 204;
};

@useAuth(SessionAutha)
@get
@route("me")
op me():
  | {
      @statusCode statusCode: 200;

      @body
      body: UserDto;
    }
  | Error.UnauthorizedError;
