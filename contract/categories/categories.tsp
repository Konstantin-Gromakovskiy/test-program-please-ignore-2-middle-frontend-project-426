import "./models.tsp";
import "@typespec/http";

using Http;
using OpenAPI;

@doc("Категории товаров")
@route("categories")
@tag("Categories")
namespace Main.Categories;

@get
@operationId("getCategories")
op index(): {
  @statusCode statusCode: 200;

  @body
  body: CategoryDto[];
};
