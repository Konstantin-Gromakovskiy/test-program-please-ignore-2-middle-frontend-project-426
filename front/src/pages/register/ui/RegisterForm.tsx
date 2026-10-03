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
import { routes } from "@/shared/config";
import { registerFormValidation } from "../lib/validation";
import { useRegisterMutation } from "../lib/register.api.ts";

export function RegisterForm() {
  const { mutate: register, isPending } = useRegisterMutation({
    onError: (error) => {
      notifications.show({
        color: "red",
        message: (
          <span data-testid="auth-error">
            {error.status === 409
              ? "Пользователь с таким email уже существует."
              : "Не удалось зарегистрироваться. Попробуйте еще раз."}
          </span>
        ),
      });
    },
    onSuccess: async () => await navigate({ to: routes.home }),
  });
  const navigate = useNavigate({ from: routes.register });

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

  function handleSubmit({ email, password }: typeof form.values) {
    register({ body: { email, password } });
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
              data-testid="auth-email"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="new-password"
              data-testid="auth-password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Подтвердите пароль"
              autoComplete="new-password"
              data-testid="auth-password-confimation"
              {...form.getInputProps("confirmPassword")}
            />
            <Button type="submit" loading={isPending} data-testid="auth-submit">
              Зарегистрироваться
            </Button>
          </Stack>
        </form>
        <Text ta="center" size="sm">
          Уже есть аккаунт?{" "}
          <Anchor component={Link} to={routes.login}>
            Войти
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
