import {
  Button,
  Checkbox,
  Group,
  NativeSelect,
  NumberInput,
  Paper,
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
    <Paper withBorder radius="md" p="md" data-testid="catalog-filters">
      <Stack gap="sm">
        <TextInput
          label="Название"
          placeholder="Поиск по названию"
          data-testid="filter-search"
          {...form.getInputProps("search")}
        />
        <NativeSelect
          label="Категория"
          data={[{ value: "", label: "Все категории" }, ...categories]}
          data-testid="filter-category"
          {...form.getInputProps("categorySlug")}
        />
        <Group grow gap="xs" align="flex-end">
          <NumberInput
            label="Цена от"
            min={0}
            hideControls
            data-testid="filter-price-min"
            {...form.getInputProps("minPrice")}
          />
          <NumberInput
            label="Цена до"
            min={0}
            hideControls
            data-testid="filter-price-max"
            {...form.getInputProps("maxPrice")}
          />
        </Group>
        <Checkbox
          label="Только в наличии"
          data-testid="filter-available"
          {...form.getInputProps("inStockOnly", { type: "checkbox" })}
        />
        <Button
          variant="outline"
          data-testid="filter-reset"
          onClick={() => form.setValues(emptyFilterValues)}
        >
          Сбросить фильтры
        </Button>
      </Stack>
    </Paper>
  );
}
