import "../products/models.tsp";

@doc("Промо-блок главной страницы: подборка, которая ведёт на товар")
model PromoDto {
  @doc("Идентификатор промо")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  id: string;

  @doc("Заголовок промо")
  @example("Игровой апгрейд")
  @maxLength(128)
  title: string;

  @doc("Текст промо")
  @example("Видеокарта для игр в Full HD и 2K по честной цене")
  @maxLength(256)
  description: string;

  @doc("Товар, на который ведёт промо. Всегда в наличии")
  product: ProductDto;
}
