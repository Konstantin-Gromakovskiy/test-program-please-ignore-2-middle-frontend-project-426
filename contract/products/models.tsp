import "../common/primitives.tsp";
import "../common/pagination.tsp";

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
  @maxLength(256)
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

model CategoryDto {
  @doc("Идентификатор категории")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  id: string;

  @doc("Название категории")
  @example("Компьютеры")
  @minLength(3)
  @maxLength(128)
  name: string;

  @doc("человекочитаемый идентификатор для URL")
  @example("computers")
  @minLength(3)
  @maxLength(128)
  slug: string;
}

model ProductsPage is Page<ProductDto>;
