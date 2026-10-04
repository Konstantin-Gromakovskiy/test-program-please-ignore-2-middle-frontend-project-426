model PageMeta {
  @doc("Размер страницы")
  @minValue(1)
  @maxValue(100)
  @example(10)
  pageSize: int32;

  @doc("Номер текущей страницы")
  @minValue(1)
  @example(1)
  page: int32;

  @doc("Общее количество элементов")
  @minValue(0)
  @example(10)
  totalItems: int32;

  @doc("Общее количество страниц")
  @minValue(0)
  @example(1)
  totalPages: int32;
}

@doc("Страница списка с метаинформацией о пагинации")
model Page<T> {
  @pageItems
  items: T[];

  meta: PageMeta;
}
