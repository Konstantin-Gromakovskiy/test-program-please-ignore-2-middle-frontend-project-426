import { Box, SimpleGrid, Title } from "@mantine/core";
import type { PromoSectionProps } from "../model/types";
import { PromoCard } from "./PromoCard";

export function PromoSection({ promos }: PromoSectionProps) {
  return (
    <Box component="section" mt="xl" data-testid="home-promo">
      <Title order={2} mb="md">
        Выбор магазина
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {promos.map((promo) => (
          <PromoCard key={promo.id} {...promo} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
