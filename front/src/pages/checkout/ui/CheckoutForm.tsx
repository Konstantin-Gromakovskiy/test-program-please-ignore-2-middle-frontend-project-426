import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { checkoutFormValidation, deliveryMethodOptions } from "../lib/validation";
import type { CheckoutFormValues, DeliveryMethod } from "../model/types";

export function CheckoutForm() {
  const form = useForm<CheckoutFormValues>({
    initialValues: {
      deliveryMethod: "delivery",
      recipientName: "",
      phone: "",
      address: "",
    },
    validate: checkoutFormValidation,
  });

  function handleSubmit(values: CheckoutFormValues) {
    console.log("Данные оформления заказа:", values);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} data-testid="checkout-form">
      <Stack>
        <Select
          label="Способ получения"
          data={deliveryMethodOptions}
          allowDeselect={false}
          data-testid="checkout-delivery-method"
          {...form.getInputProps("deliveryMethod")}
          onChange={(value) => {
            form.setFieldValue("deliveryMethod", value as DeliveryMethod);
            form.clearFieldError("address");
          }}
        />
        <TextInput
          label="Имя получателя"
          autoComplete="name"
          data-testid="checkout-recipient-name"
          {...form.getInputProps("recipientName")}
        />
        <TextInput
          label="Телефон"
          placeholder="+7 900 000-00-00"
          type="tel"
          autoComplete="tel"
          data-testid="checkout-phone"
          {...form.getInputProps("phone")}
        />
        {form.values.deliveryMethod === "delivery" && (
          <TextInput
            label="Адрес"
            placeholder="г. Москва, ул. Тверская, д. 1, кв. 10"
            autoComplete="street-address"
            data-testid="checkout-address"
            {...form.getInputProps("address")}
          />
        )}
        <Button type="submit" data-testid="checkout-submit">
          Оформить заказ
        </Button>
      </Stack>
    </form>
  );
}
