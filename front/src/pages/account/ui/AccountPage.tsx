import { Alert, Anchor, Box, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useGetOrdersQuery } from "@/shared/api";
import { routes } from "@/shared/config";
import { toOrderCard } from "../lib/toOrderCard";
import { OrdersList } from "./OrdersList";

const route = getRouteApi("/_authenticated/account");

export function AccountPage() {
  const { page } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError } = useGetOrdersQuery({ query: { page } });

  const handlePageChange = (nextPage: number) =>
    navigate({ search: { page: nextPage } });

  return (
    <Box p="xs" data-testid="account-page">
      <Title order={3} mb="md">
        Личный кабинет
      </Title>
      <Title order={4} mb="md">
        Мои заказы
      </Title>
      {isPending && (
        <Center mih="40vh">
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert color="red" data-testid="orders-error">
          Не удалось загрузить заказы
        </Alert>
      )}
      {data && data.items.length === 0 && (
        <Center mih="40vh" data-testid="account-orders-empty">
          <Stack align="center" gap="xs">
            <Text>Заказов пока нет</Text>
            <Anchor component={Link} to={routes.catalog}>
              Перейти в каталог
            </Anchor>
          </Stack>
        </Center>
      )}
      {data && data.items.length > 0 && (
        <OrdersList
          orders={data.items.map(toOrderCard)}
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
}
