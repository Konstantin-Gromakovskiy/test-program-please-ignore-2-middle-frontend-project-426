import { hasLength, isEmail } from "@mantine/form";

export const registerFormValidation = {
  email: isEmail("Введите корректный email"),
  password: hasLength(
    { min: 8, max: 128 },
    "Пароль должен содержать от 8 до 128 символов",
  ),
};
