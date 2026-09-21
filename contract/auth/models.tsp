model UserDto {
  @doc("Идентификатор пользователя")
  @example(1)
  id: decimal;

  @doc("Пароль пользователя")
  @example("test@test.com")
  email: string;
}

model LoginParams extends UserDto {
  @doc("Пароль пользователя")
  @example("password")
  password: string;
}
