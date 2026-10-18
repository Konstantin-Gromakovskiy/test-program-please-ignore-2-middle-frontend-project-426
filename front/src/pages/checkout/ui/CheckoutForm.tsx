import { Alert, Button, List, NativeSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "@tanstack/react-router";
import { useCartStore } from "@/entities/cart";
import { useCreateOrderMutation } from "../lib/createOrder.api";
import { toCreateOrderBody } from "../lib/createOrderBody";
import { toOrderErrorView } from "../lib/toOrderErrorView";
import { checkoutFormValidation, deliveryMethodOptions } from "../lib/validation";
import type { CheckoutFormProps, CheckoutFormValues } from "../model/types";

export function CheckoutForm({ lines }: CheckoutFormProps) {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clear);

  const {
    mutate: createOrder,
    isPending,
    error,
  } = useCreateOrderMutation({
    onSuccess: async (order) => {
      // Сначала уходим со страницы, чтобы не мигала «Корзина пуста»
      await navigate({
        to: "/checkout/success",
        search: { orderId: order.id },
      });
      clearCart();
    },
  });

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
    createOrder({ body: toCreateOrderBody(values, lines) });
  }

  const errorView = error && toOrderErrorView(error);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} data-testid="checkout-form">
      <Stack>
        <NativeSelect
          label="Способ получения"
          data={deliveryMethodOptions}
          data-testid="checkout-method"
          {...form.getInputProps("deliveryMethod")}
          onChange={(event) => {
            form.setFieldValue(
              "deliveryMethod",
              event.currentTarget.value as CheckoutFormValues["deliveryMethod"],
            );
            form.clearFieldError("address");
          }}
        />
        <TextInput
          label="Имя получателя"
          autoComplete="name"
          data-testid="checkout-name"
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
        {errorView && (
          <Alert color="red" data-testid="order-error">
            {errorView.message}
            {errorView.problems.length > 0 && (
              <List size="sm" mt="xs">
                {errorView.problems.map((problem) => (
                  <List.Item key={problem}>{problem}</List.Item>
                ))}
              </List>
            )}
          </Alert>
        )}
        <Button
          type="submit"
          loading={isPending}
          disabled={lines.length === 0}
          data-testid="checkout-submit"
        >
          Оформить заказ
        </Button>
      </Stack>
    </form>
  );
}
