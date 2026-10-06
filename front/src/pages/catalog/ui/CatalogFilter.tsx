import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { emptyFilterValues } from "../lib/filterValues";
import type { CatalogFilterProps, CatalogFilterValues } from "../model/types";

const APPLY_DELAY_MS = 400;

export function CatalogFilter({
  values,
  categories,
  onChange,
}: CatalogFilterProps) {
  const applyChange = useDebouncedCallback(onChange, APPLY_DELAY_MS);
  const form = useForm<CatalogFilterValues>({
    initialValues: values,
    onValuesChange: applyChange,
  });

  return (
    <Paper withBorder radius="md" p="md" data-testid="catalog-filter">
      <Stack gap="sm">
        <TextInput
          label="Название"
          placeholder="Поиск по названию"
          {...form.getInputProps("search")}
        />
        <Select
          label="Категория"
          placeholder="Все категории"
          data={categories}
          clearable
          {...form.getInputProps("categorySlug")}
        />
        <Group grow gap="xs" align="flex-end">
          <NumberInput
            label="Цена от"
            min={0}
            hideControls
            {...form.getInputProps("minPrice")}
          />
          <NumberInput
            label="Цена до"
            min={0}
            hideControls
            {...form.getInputProps("maxPrice")}
          />
        </Group>
        <Checkbox
          label="Только в наличии"
          {...form.getInputProps("inStockOnly", { type: "checkbox" })}
        />
        <Button
          variant="outline"
          onClick={() => form.setValues(emptyFilterValues)}
        >
          Сбросить фильтры
        </Button>
      </Stack>
    </Paper>
  );
}
