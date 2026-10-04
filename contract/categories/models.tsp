model CategoryDto {
  @doc("Идентификатор категории")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  id: string;

  @doc("Название категории")
  @example("Процессоры")
  @minLength(3)
  @maxLength(128)
  name: string;

  @doc("человекочитаемый идентификатор для URL")
  @example("cpu")
  @minLength(3)
  @maxLength(128)
  slug: string;
}
