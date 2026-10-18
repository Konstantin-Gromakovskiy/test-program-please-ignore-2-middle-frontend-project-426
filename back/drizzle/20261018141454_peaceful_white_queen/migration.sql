ALTER TABLE "orders" ADD COLUMN "recipient_name" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "recipient_phone" varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_quantity_positive", ADD CONSTRAINT "order_items_quantity_positive" CHECK ("quantity"
    > 0);--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_unit_price_non_negative", ADD CONSTRAINT "order_items_unit_price_non_negative" CHECK ("unit_price"
    >= 0);--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_delivery_consistency", ADD CONSTRAINT "orders_delivery_consistency" CHECK (("delivery_method" = 'pickup' AND "shipping_address" IS NULL)
          OR(
          "delivery_method"
          =
          'delivery'
          AND
          "shipping_address"
          IS
          NOT
          NULL
          )
      );--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_total_non_negative", ADD CONSTRAINT "orders_total_non_negative" CHECK ("total"
    >= 0);