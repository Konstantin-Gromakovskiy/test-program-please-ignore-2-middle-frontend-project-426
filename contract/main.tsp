import "@typespec/http";
import "@typespec/openapi";
import "./auth/auth.tsp";
import "./categories/categories.tsp";
import "./products/products.tsp";
import "./orders/orders.tsp";
import "./promos/promos.tsp";

using Http;
using OpenAPI;

@service(#{ title: "Computer parts store" })
@server("http://localhost:3000", "Single server endpoint")
@summary("Это саммари")
@tagMetadata(
  "Auth",
  #{
    description: "Методы, отвечающие за авторизацию, регистрацию и выход из приложения",
  }
)
@tagMetadata(
  "Products",
  #{ description: "Методы, отвечающие за операции над товарами" }
)
@tagMetadata(
  "Categories",
  #{ description: "Методы, отвечающие за категории товаров" }
)
@tagMetadata(
  "Orders",
  #{ description: "Методы, отвечающие за оформление и получение заказов" }
)
@tagMetadata(
  "Promos",
  #{ description: "Методы, отвечающие за промо-блоки главной страницы" }
)
@doc("Бекенд сервис магазина комплектующих для пк")
@route("api")
namespace Main;

@doc("Проверка статуса сервиса")
@route("health")
@operationId("healthCheck")
op healthCheck(): {
  @statusCode statusCode: 200;

  @body
  body: {
    status: "ok";
  };
};

model ErrorCheckResponse {
  error: string;
}

alias ErrorCheckStatusCode = 400 | 401 | 403 | 404 | 409 | 500;

@route("error-check")
@operationId("errorCheck")
op errorCheck(@path statusCode: ErrorCheckStatusCode):
  | {
      @statusCode statusCode: 400;
      @body body: ErrorCheckResponse;
    }
  | {
      @statusCode statusCode: 401;
      @body body: ErrorCheckResponse;
    }
  | {
      @statusCode statusCode: 403;
      @body body: ErrorCheckResponse;
    }
  | {
      @statusCode statusCode: 404;
      @body body: ErrorCheckResponse;
    }
  | {
      @statusCode statusCode: 409;
      @body body: ErrorCheckResponse;
    }
  | {
      @statusCode statusCode: 500;
      @body body: ErrorCheckResponse;
    };
