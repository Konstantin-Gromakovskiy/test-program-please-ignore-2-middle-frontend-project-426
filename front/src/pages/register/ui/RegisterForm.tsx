import { useState } from "react";
import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { registerFormValidation } from "../lib/validation";

export function RegisterForm() {
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateInputOnChange: hasValidationErrors,
    validate: registerFormValidation,
  });

  return (
    <Paper withBorder shadow="sm" p="xl" w="100%" maw={420}>
      <Stack>
        <Title order={1} ta="center">
          Регистрация
        </Title>
        <form
          onSubmit={form.onSubmit(
            () => {},
            () => setHasValidationErrors(true),
          )}
        >
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              type="email"
              autoFocus
              autoComplete="email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="new-password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Подтвердите пароль"
              autoComplete="new-password"
              {...form.getInputProps("confirmPassword")}
            />
            <Button type="submit">Зарегистрироваться</Button>
          </Stack>
        </form>
        <Text ta="center" size="sm">
          Уже есть аккаунт? <Anchor href="/login">Войти</Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
