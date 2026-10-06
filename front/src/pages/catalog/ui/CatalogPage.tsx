import { Alert, Box, Center, Flex, Loader, Text, Title } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";
import { toProductCardProps } from "@/entities/product";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/shared/api";
import { toFilterValues, toProductsQuery, toSearch } from "../lib/filterValues";
import type { CatalogFilterValues } from "../model/types";
import { CatalogDashboard } from "./CatalogDashboard";
import { CatalogFilter } from "./CatalogFilter";

const route = getRouteApi("/catalog");

export function CatalogPage() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError } = useGetProductsQuery({
    query: toProductsQuery(search),
  });
  const { data: categories } = useGetCategoriesQuery();

  const filterValues = toFilterValues(search);

  const handlePageChange = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const handleFilterChange = (values: CatalogFilterValues) =>
    navigate({ search: toSearch(values) });

  return (
    <div className="p-2">
      <Title order={3} mb="md">
        Каталог
      </Title>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="lg"
        align="flex-start"
      >
        <Box w={{ base: "100%", md: 288 }} flex="none">
          <CatalogFilter
            values={filterValues}
            categories={(categories ?? []).map(({ slug, name }) => ({
              value: slug,
              label: name,
            }))}
            onChange={handleFilterChange}
          />
        </Box>
        <Box w="100%" miw={0} flex={1}>
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
        </Box>
      </Flex>
    </div>
  );
}
