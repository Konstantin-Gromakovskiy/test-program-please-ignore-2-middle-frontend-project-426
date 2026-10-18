import { Anchor, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { OrderCardProps } from "../model/types";

export function OrderCard({
  id,
  number,
  methodLabel,
  summary,
  total,
}: OrderCardProps) {
  return (
    <Card withBorder padding="md" data-testid="order-card">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Group gap="xs">
            <Anchor
              fw={600}
              renderRoot={(props) => (
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: id }}
                  {...props}
                />
              )}
              data-testid="order-card-number"
            >
              Заказ № {number}
            </Anchor>
            <Badge variant="light" data-testid="order-card-method">
              {methodLabel}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" lineClamp={2} data-testid="order-card-summary">
            {summary}
          </Text>
        </Stack>
        <Text fw={700} style={{ whiteSpace: "nowrap" }} data-testid="order-card-total">
          {total}
        </Text>
      </Group>
    </Card>
  );
}
