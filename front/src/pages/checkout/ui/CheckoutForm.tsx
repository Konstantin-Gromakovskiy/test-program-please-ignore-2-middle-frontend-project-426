import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-router";
import { useCartStore } from "@/entities/cart";
import { routes } from "@/shared/config";
import { useCreateOrderMutation } from "../lib/createOrder.api";
import { toCreateOrderBody } from "../lib/createOrderBody";
import { checkoutFormValidation, deliveryMethodOptions } from "../lib/validation";
import type {
  CheckoutFormProps,
  CheckoutFormValues,
  DeliveryMethod,
} from "../model/types";

export function CheckoutForm({ lines }: CheckoutFormProps) {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clear);

  const { mutate: createOrder, isPending } = useCreateOrderMutation({
    onError: (error) => {
      notifications.show({
        color: "red",
        message: (
          <span data-testid="checkout-error">
            {error.status === 409
              ? "Некоторых товаров не хватает на складе. Проверьте корзину."
              : "Не удалось оформить заказ. Попробуйте еще раз."}
          </span>
        ),
      });
    },
    onSuccess: async () => {
      clearCart();
      notifications.show({ color: "green", message: "Заказ оформлен" });
      await navigate({ to: routes.catalog, search: { page: 1 } });
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
