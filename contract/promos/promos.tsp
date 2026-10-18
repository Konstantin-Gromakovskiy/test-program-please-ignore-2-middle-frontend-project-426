import "./models.tsp";
import "@typespec/http";

using Http;
using OpenAPI;

@doc("Промо-блоки главной страницы")
@route("promos")
@tag("Promos")
namespace Main.Promos;

@doc("Список промо в порядке показа. Товары без остатка в список не попадают")
@get
@operationId("getPromos")
op index(): {
  @statusCode statusCode: 200;

  @body
  body: PromoDto[];
};
