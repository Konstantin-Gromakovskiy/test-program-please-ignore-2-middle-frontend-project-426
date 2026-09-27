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
import { useLoginMutation } from "../lib/login.api";

export function LoginForm() {
  const navigate = useNavigate({ from: routes.login });
  const { mutate: login, isPending } = useLoginMutation({
    onError: (error) => {
      notifications.show({
        color: "red",
        message:
          error.status === 401
            ? "Неверный email или пароль."
            : "Не удалось войти. Попробуйте еще раз.",
      });
    },
    onSuccess: async () => await navigate({ to: routes.home }),
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: typeof form.values) {
    login({ body: values });
  }

  return (
    <Paper withBorder shadow="sm" p="xl" w="100%" maw={420}>
      <Stack>
        <Title order={1} ta="center">
          Вход
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
              autoComplete="current-password"
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={isPending}>
              Войти
            </Button>
          </Stack>
        </form>
        <Text ta="center" size="sm">
          Еще не зарегистрированы?{" "}
          <Anchor component={Link} to={routes.register}>
            Зарегистрироваться
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
