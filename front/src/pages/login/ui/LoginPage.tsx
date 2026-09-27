import { Paper, Text, Title } from "@mantine/core";

export function LoginPage() {
  return (
    <Paper withBorder shadow="sm" p="xl" maw={420} mx="auto" mt="xl">
      <Title order={1} ta="center">
        Вход
      </Title>
      <Text ta="center" mt="md">
        Форма входа появится позже.
      </Text>
    </Paper>
  );
}
