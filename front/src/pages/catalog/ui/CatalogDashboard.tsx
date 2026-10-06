import { Pagination, SimpleGrid } from "@mantine/core";
import { ProductCard } from "@/entities/product";
import type { CatalogDashboardProps } from "../model/types";

export function CatalogDashboard({
  products,
  page,
  totalPages,
  onPageChange,
}: CatalogDashboardProps) {
  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </SimpleGrid>
      {totalPages > 1 && (
        <Pagination
          mt="lg"
          value={page}
          total={totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
