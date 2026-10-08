import { Pagination, SimpleGrid } from "@mantine/core";
import { useCartStore } from "@/entities/cart";
import { ProductCard } from "@/entities/product";
import { getPaginationControlProps } from "../lib/paginationControlProps";
import type { CatalogDashboardProps } from "../model/types";

export function CatalogDashboard({
  products,
  page,
  totalPages,
  onPageChange,
}: CatalogDashboardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 2 }}
        spacing="md"
        data-testid="catalog-list"
      >
        {products.map((product) => (
          <ProductCard key={product.id} {...product} onAddToCart={addItem} />
        ))}
      </SimpleGrid>
      <Pagination
        mt="lg"
        value={page}
        total={totalPages}
        onChange={onPageChange}
        data-testid="catalog-pagination"
        getControlProps={getPaginationControlProps}
      />
    </div>
  );
}
