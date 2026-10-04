import { Link } from "@tanstack/react-router";
import { Anchor, Box, Button, Container, Group } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import viteLogo from "@/assets/hero.png";
import { routes } from "@/shared/config";
import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/entitie/user/api/me";
import { useLogoutMutation } from "@/shared/api";
import { meQueryKey } from "@/shared/api";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { data: user, isLoading } = useQuery(meQueryOptions());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey(), null);
      navigate({ to: routes.login });
    },
    onError: () => {
      notifications.show({
        color: "red",
        message: "Не удалось выйти. Попробуйте еще раз.",
      });
    },
  });
  const handleLogout = () => logout({});

  console.log("user", user);
  console.log("isLoading", isLoading);

  return (
    <Box
      component="header"
      py="xs"
      style={(theme) => ({
        boxShadow: theme.shadows.sm,
      })}
    >
      <Container size={1126}>
        <Group justify="space-between" align="center">
          <img src={viteLogo} alt="logo" width={30} />
          <Group>
            <Anchor component={Link} to={routes.catalog}>
              Каталог
            </Anchor>
            <Anchor component={Link} to={routes.about}>
              Корзина
            </Anchor>
          </Group>
          {isLoading || user === null ? (
            <Group>
              <Button
                component={Link}
                to={routes.login}
                data-testid="nav-signin"
              >
                Вход
              </Button>
              <Button
                component={Link}
                to={routes.register}
                variant="outline"
                data-testid="nav-signup"
              >
                Регистрация
              </Button>
            </Group>
          ) : (
            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              data-testid="nav-signout"
            >
              Выход
            </Button>
          )}
        </Group>
      </Container>
    </Box>
  );
}
