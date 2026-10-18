import { Badge, Button, Card, Divider, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { OrderCardProps } from "../model/types";

export function OrderCard({
  number,
  status,
  statusLabel,
  createdAt,
  methodLabel,
  lines,
  total,
}: OrderCardProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card withBorder padding="md" data-testid="account-order-item">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Group gap="xs">
            <Text fw={600}>Заказ № {number}</Text>
            <Badge variant="light" data-testid="order-status" data-status={status}>
              {statusLabel}
            </Badge>
            <Badge variant="outline" color="gray">
              {methodLabel}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed" data-testid="account-order-date">
            {createdAt}
          </Text>
        </Stack>
        <Text fw={700} style={{ whiteSpace: "nowrap" }} data-testid="order-total">
          {total}
        </Text>
      </Group>
      <Button
        variant="subtle"
        size="compact-sm"
        mt="xs"
        w="fit-content"
        onClick={toggle}
        aria-expanded={opened}
        data-testid="account-order-toggle"
      >
        {opened ? "Скрыть состав" : "Показать состав"}
      </Button>
      {opened && (
        <>
          <Divider my="sm" />
          <Stack gap="xs">
            {lines.map((line) => (
              <Group
                key={line.id}
                justify="space-between"
                wrap="nowrap"
                data-testid="account-order-line"
              >
                <Text truncate>{line.name}</Text>
                <Group gap="md" wrap="nowrap">
                  <Text size="sm" c="dimmed" data-testid="account-order-line-qty">
                    {line.quantity}
                  </Text>
                  <Text size="sm" data-testid="account-order-line-price">
                    {line.unitPrice}
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
