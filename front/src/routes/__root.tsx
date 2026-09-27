import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Anchor, Container, Group, Box, Button } from "@mantine/core";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import viteLogo from "@/assets/hero.png";
import { routes } from "@/shared/config";

export const Route = createRootRoute({
  component: () => (
    <Box mih="100svh" display="flex" style={{ flexDirection: "column" }}>
      <Box
        component="header"
        py="xs"
        style={(theme) => ({
          boxShadow: theme.shadows.sm,
        })}
      >
        {" "}
        <Container size={1126}>
          <Group justify="space-between" align="center">
            <img src={viteLogo} alt="logo" width={30} />
            <Group>
              <Anchor component={Link} to={routes.home}>
                Каталог
              </Anchor>
              <Anchor component={Link} to={routes.about}>
                Корзина
              </Anchor>
            </Group>
            <Group>
              <Button>Вход</Button>
              <Button component={Link} to={routes.register} variant="outline">
                Регистрация
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>
      <main style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Container size={1126} style={{ flex: 1 }}>
          <Outlet />
        </Container>
      </main>
      <TanStackRouterDevtools />
    </Box>
  ),
});
