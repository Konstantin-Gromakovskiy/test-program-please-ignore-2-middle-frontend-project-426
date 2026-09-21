model UserDto {
  @doc("Идентификатор пользователя")
  @example("df8b568e-7a35-4e3f-8218-ed02fb710858")
  @format("uuid")
  id: string;

  @doc("Email пользователя")
  @example("test@test.com")
  @format("email")
  email: string;
}

model Credentials {
  email: UserDto.email;

  @doc("Пароль пользователя")
  @example("password")
  @minLength(8)
  @maxLength(128)
  password: string;
}
