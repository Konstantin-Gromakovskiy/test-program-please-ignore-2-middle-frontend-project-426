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
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "@tanstack/react-router";
import { registerFormValidation } from "../lib/validation";
import { useRegisterMutation } from "../lib/register.api.ts";

export function RegisterForm() {
  const { mutateAsync: register, isPending } = useRegisterMutation();
  const navigate = useNavigate({ from: "/register" });

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

  async function handleSubmit({ email, password }: typeof form.values) {
    try {
      await register({ body: { email, password } });
      await navigate({ to: "/login" });
    } catch {
      notifications.show({
        color: "red",
        message: "Не удалось зарегистрироваться. Попробуйте еще раз.",
      });
    }
  }

  return (
    <Paper withBorder shadow="sm" p="xl" w="100%" maw={420}>
      <Stack>
        <Title order={1} ta="center">
          Регистрация
        </Title>
        <form
          onSubmit={form.onSubmit(handleSubmit, () =>
            setHasValidationErrors(true),
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
            <Button type="submit" loading={isPending}>
              Зарегистрироваться
            </Button>
          </Stack>
        </form>
        <Text ta="center" size="sm">
          Уже есть аккаунт?{" "}
          <Anchor component={Link} to="/login">
            Войти
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
