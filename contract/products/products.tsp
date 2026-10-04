import "./models.tsp";
import "@typespec/http";
import "../common/error.tsp";

using Http;
using OpenAPI;

@doc("Товары")
@route("products")
@tag("Products")
namespace Main.Products;

@get
@list
@operationId("getProducts")
op index(
  @query
  @pageIndex
  @minValue(1)
  @example(1)
  page?: int32 = 1,

  @query
  @minValue(1)
  @maxValue(100)
  @example(10)
  @pageSize
  pageSize?: int32 = 10,

  @query
  @doc("Slug категории для фильтрации продуктов")
  categorySlug?: CategoryDto.slug,

  @query
  @doc("Минимальная цена в копейках (включительно)")
  @minValue(0)
  @example(100000)
  minPrice?: int32,

  @query
  @doc("Максимальная цена в копейках (включительно)")
  @minValue(0)
  @example(500000)
  maxPrice?: int32,

  @query
  @doc("Фильтр по наличию: все продукты, только в наличии или только отсутствующие")
  availability?: Availability = Availability.all,
):
  | {
      @statusCode statusCode: 200;
      @body _: ProductsPage;
    }
  | Error.BadRequestError;
