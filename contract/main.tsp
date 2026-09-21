import "@typespec/http";
import "@typespec/openapi";
import "./auth/auth.tsp";

using Http;
using OpenAPI;

@service(#{ title: "Computer parts store" })
@server("https://example.com", "Single server endpoint")
@summary("Это саммари")
@tagMetadata(
  "Auth",
  #{
    description: "Методы, отвечающие за авторизацию, регистрацию и выход из приложения",
  }
)
@doc("Бекенд сервис магазина комплектующих для пк")
namespace Main;
