import "../common/primitives.tsp";
import "../common/pagination.tsp";
import "../categories/models.tsp";

model ProductDto {
  @doc("Идентификатор продукта")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  id: string;

  @doc("Название продукта")
  @example("Компьютер")
  @maxLength(128)
  name: string;

  @doc("Описание продукта")
  @example("Компьютер с процессором i7")
  @maxLength(255)
  description: string;

  @doc("Цена продукта в копейках")
  @example(100)
  @minValue(0)
  price: int32;

  @doc("Количество элементов в продукте")
  @example(10)
  @minValue(0)
  stock: int32;

  @doc("Категория продукта")
  category: CategoryDto;
}

@doc("Фильтр продуктов по наличию")
enum Availability {
  @doc("Все продукты")
  all,

  @doc("Только продукты в наличии")
  inStock,

  @doc("Только продукты, которых нет в наличии")
  outOfStock,
}

model ProductsPage is Page<ProductDto>;
