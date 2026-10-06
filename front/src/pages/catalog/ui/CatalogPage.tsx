import { Alert, Center, Loader, Text, Title } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";
import { toProductCardProps } from "@/entities/product";
import { useGetProductsQuery } from "@/shared/api";
import { CatalogDashboard } from "./CatalogDashboard";

const route = getRouteApi("/catalog");

export function CatalogPage() {
  const { page } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError } = useGetProductsQuery({ query: { page } });

  const handlePageChange = (nextPage: number) =>
    navigate({ search: { page: nextPage } });

  return (
    <div className="p-2">
      <Title order={3} mb="md">
        Каталог
      </Title>
      {isPending && (
        <Center mih="60vh">
          <Loader />
        </Center>
      )}
      {isError && <Alert color="red">Не удалось загрузить товары</Alert>}
      {data && data.items.length === 0 && <Text>Товаров нет</Text>}
      {data && data.items.length > 0 && (
        <CatalogDashboard
          products={data.items.map(toProductCardProps)}
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
