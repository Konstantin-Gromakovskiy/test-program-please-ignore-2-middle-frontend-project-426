export type DeliveryMethod = "delivery" | "pickup";

export type CheckoutFormValues = {
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  phone: string;
  address: string;
};
