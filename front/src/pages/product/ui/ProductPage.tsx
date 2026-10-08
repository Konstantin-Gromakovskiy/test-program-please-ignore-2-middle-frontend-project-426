import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";
import { formatPrice } from "@/entities/product";
import { useGetProductQuery } from "@/shared/api";

const route = getRouteApi("/products/$productId");

const IMAGE_FALLBACK = "https://placehold.co/600x450?text=Нет+фото";

export function ProductPage() {
  const { productId } = route.useParams();
  const { data: product, isPending, isError } = useGetProductQuery({
    path: { id: productId },
  });

  if (isPending) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Box p="xs">
        <Alert color="red" data-testid="product-error">
          Не удалось загрузить товар
        </Alert>
      </Box>
    );
  }

  const inStock = product.stock > 0;

  return (
    <Box p="xs" data-testid="product-page">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 32, md: 64 }}
      >
        <Image
          src={product.imageUrl}
          fallbackSrc={IMAGE_FALLBACK}
          alt={product.name}
          w={{ base: "100%", md: 480 }}
          maw="100%"
          radius="md"
          fit="cover"
          style={{ flexShrink: 0 }}
          data-testid="product-image"
        />
        <Stack gap="md" align="flex-start">
          <Title order={2} data-testid="product-name">
            {product.name}
          </Title>
          <Badge
            color={inStock ? "green" : "gray"}
            data-testid="product-availability"
            data-available={inStock}
          >
            {inStock ? "В наличии" : "Нет в наличии"}
          </Badge>
          <Text data-testid="product-description">{product.description}</Text>
          <Text size="xl" fw={700} data-testid="product-price">
            {formatPrice(product.price)}
          </Text>
          <Button data-testid="product-add-to-cart">В корзину</Button>
        </Stack>
      </Flex>
    </Box>
  );
}
