import "../common/pagination.tsp";
import "../products/models.tsp";

model CreateOrderItemDto {
  @doc("Идентификатор продукта")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  productId: string;

  @doc("Количество единиц продукта в заказе")
  @example(2)
  @minValue(1)
  @maxValue(100)
  quantity: int32;
}

alias DeliveryMethod = "delivery" | "pickup";

model CreateOrderRequest {
  @doc("Позиции заказа")
  @minItems(1)
  items: CreateOrderItemDto[];

  @doc("Способ получения заказа")
  @example("delivery")
  deliveryMethod: DeliveryMethod;

  @doc("Имя получателя")
  @example("Иван Иванов")
  @minLength(1)
  @maxLength(128)
  recipientName: string;

  @doc("Телефон получателя в формате +7XXXXXXXXXX")
  @example("+79001234567")
  @pattern("^\\+7\\d{10}$")
  recipientPhone: string;

  @doc("Адрес доставки. Обязателен для доставки, для самовывоза не передаётся")
  @example("г. Москва, ул. Тверская, д. 1, кв. 10")
  @minLength(1)
  @maxLength(512)
  shippingAddress?: string;
}

@doc("Позиция заказа: снимок продукта на момент оформления")
model OrderItemDto {
  @doc("Идентификатор позиции заказа")
  @example("123e4567-e89b-12d3-a456-426655440000")
  @format("uuid")
  id: string;

  @doc("Идентификатор продукта")
  productId: ProductDto.id;

  @doc("Название продукта на момент оформления")
  productName: ProductDto.name;

  @doc("Ссылка на изображение продукта на момент оформления")
  imageUrl: ProductDto.imageUrl;

  @doc("Цена за единицу продукта в копейках на момент оформления")
  unitPrice: ProductDto.price;

  @doc("Количество единиц продукта в позиции")
  @example(2)
  @minValue(1)
  quantity: int32;
}

model OrderDto {
  @doc("Идентификатор заказа")
  @example("123e4567-e89b-12d3-a456-426655440000")
  @format("uuid")
  id: string;

  @doc("Статус заказа. Заказ оплачивается сразу при оформлении")
  status: "paid";

  @doc("Позиции заказа")
  items: OrderItemDto[];

  @doc("Итоговая сумма заказа в копейках")
  @example(3798000)
  @minValue(0)
  total: int32;

  @doc("Способ получения заказа")
  @example("delivery")
  deliveryMethod: DeliveryMethod;

  @doc("Имя получателя")
  @example("Иван Иванов")
  @maxLength(128)
  recipientName: string;

  @doc("Телефон получателя в формате +7XXXXXXXXXX")
  @example("+79001234567")
  recipientPhone: string;

  @doc("Адрес доставки. Отсутствует у заказов с самовывозом")
  @example("г. Москва, ул. Тверская, д. 1, кв. 10")
  @maxLength(512)
  shippingAddress?: string;
}

model OrdersPage is Page<OrderDto>;
