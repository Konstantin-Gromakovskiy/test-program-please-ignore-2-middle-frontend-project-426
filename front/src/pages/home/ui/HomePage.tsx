import {
  Alert,
  Box,
  Button,
  Center,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { useGetPromosQuery } from "@/shared/api";
import { routes } from "@/shared/config";
import { toPromoCard } from "../lib/toPromoCard";
import { PromoSection } from "./PromoSection";

export function HomePage() {
  const { data, isPending, isError } = useGetPromosQuery();

  return (
    <Box p="xs" data-testid="home-page">
      <Stack gap="md" align="flex-start" py="xl">
        <Title order={1} data-testid="home-title">
          Комплектующие для ПК с доставкой по городу
        </Title>
        <Text size="lg" c="dimmed" data-testid="home-subtitle">
          Видеокарты, процессоры и материнские платы в наличии. Собираем
          подборки под задачу.
        </Text>
        <Button
          component={Link}
          to={routes.catalog}
          size="md"
          data-testid="home-catalog-link"
        >
          Перейти в каталог
        </Button>
      </Stack>
      {isPending && (
        <Center mih={200}>
          <Loader />
        </Center>
      )}
      {isError && (
        <Alert color="red" data-testid="home-promo-error">
          Не удалось загрузить подборки
        </Alert>
      )}
      {/* Блок появляется только вместе с карточками: пустой контейнер ничего не обещает */}
      {data && data.length > 0 && (
        <PromoSection promos={data.map(toPromoCard)} />
      )}
    </Box>
  );
}
