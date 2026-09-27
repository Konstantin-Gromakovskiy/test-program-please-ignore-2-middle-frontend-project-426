import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Anchor, Container, Group, Box, Button } from "@mantine/core";

import viteLogo from "@/assets/hero.png";

export const Route = createRootRoute({
  component: () => (
    <>
      <Box
        component="header"
        py="xs"
        style={(theme) => ({
          boxShadow: theme.shadows.sm,
        })}
      >
        {" "}
        <Container>
          <Group justify="space-between" align="center">
            <img src={viteLogo} alt="logo" width={30} />
            <Group>
              <Anchor component={Link} to="/">
                Каталог
              </Anchor>
              <Anchor component={Link} to="/about">
                Корзина
              </Anchor>
            </Group>
            <Group>
              <Button>Вход</Button>
              <Button variant="outline">Регистрация</Button>
            </Group>
          </Group>
        </Container>
      </Box>
      <Outlet />
    </>
  ),
});
