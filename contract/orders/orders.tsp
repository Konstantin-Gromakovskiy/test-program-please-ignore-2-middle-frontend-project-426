import "./models.tsp";
import "@typespec/http";
import "../common/error.tsp";
import "../common/sessionAuth.tsp";

using Http;
using OpenAPI;

namespace Main.Orders;
@route("/orders")
@tag("Orders")
interface Orders {
  @doc("Оформить заказ. Остатки на складе списываются сразу")
  @useAuth(SessionAuth)
  @post
  @operationId("createOrder")
  create(@body _: CreateOrderRequest):
    | {
        @statusCode statusCode: 201;

        @body
        _: OrderDto;
      }
    | Error.UnauthorizedError
    | Error.BadRequestError
    | Error.ConflictError
    | Error.NotFoundError;

  @doc("Список заказов текущего пользователя, новые первыми")
  @useAuth(SessionAuth)
  @get
  @operationId("getOrders")
  @list
  index(
    @query
    @pageIndex
    @minValue(1)
    @example(1)
    page?: int32 = 1,

    @query
    @pageSize
    @minValue(1)
    @maxValue(100)
    @example(10)
    pageSize?: int32 = 10,
  ):
    | {
        @statusCode statusCode: 200;
        @body _: OrdersPage;
      }
    | Error.BadRequestError
    | Error.UnauthorizedError;

  @doc("Заказ текущего пользователя. Чужой заказ возвращается как не найденный")
  @useAuth(SessionAuth)
  @get
  @route("{id}")
  @operationId("getOrder")
  show(
    @path
    @doc("Идентификатор заказа")
    @format("uuid")
    @example("123e4567-e89b-12d3-a456-426655440000")
    id: string,
  ):
    | {
        @statusCode statusCode: 200;
        @body _: OrderDto;
      }
    | Error.BadRequestError
    | Error.UnauthorizedError
    | Error.NotFoundError;
}
