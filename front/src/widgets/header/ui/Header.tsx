import { Link } from "@tanstack/react-router";
import { Anchor, Badge, Box, Button, Container, Group } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import viteLogo from "@/assets/hero.png";
import { routes } from "@/shared/config";
import { useQuery } from "@tanstack/react-query";
import { useCartCount } from "@/entities/cart";
import { meQueryOptions } from "@/entities/user";
import { useLogoutMutation } from "@/shared/api";
import { meQueryKey } from "@/shared/api";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { data: user, isLoading } = useQuery(meQueryOptions());
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cartCount = useCartCount();

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

  return (
    <Box
      component="header"
      py="xs"
      style={(theme) => ({
        boxShadow: theme.shadows.sm,
      })}
    >
      <Container size={1600}>
        <Group justify="space-between" align="center">
          <img src={viteLogo} alt="logo" width={30} />
          <Group>
            <Anchor
              component={Link}
              to={routes.catalog}
              data-testid="nav-catalog"
            >
              Каталог
            </Anchor>
            <Button
              type="button"
              variant="default"
              rightSection={
                cartCount > 0 ? (
                  <Badge
                    size="sm"
                    circle
                    data-testid="nav-cart-count"
                  >
                    {cartCount}
                  </Badge>
                ) : null
              }
              data-testid="nav-cart"
            >
              Корзина
            </Button>
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
