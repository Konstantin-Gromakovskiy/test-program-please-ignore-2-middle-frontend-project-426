import { hasLength, isEmail, matchesField } from "@mantine/form";

export const registerFormValidation = {
  email: isEmail("Введите корректный email"),
  password: hasLength(
    { min: 8, max: 128 },
    "Пароль должен содержать от 8 до 128 символов",
  ),
  confirmPassword: matchesField("password", "Пароли не совпадают"),
};
