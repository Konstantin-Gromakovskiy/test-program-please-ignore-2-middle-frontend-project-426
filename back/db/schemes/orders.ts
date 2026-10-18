import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  integer,
  pgEnum,
  check,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users.js'
import { products } from './products.js'

export const orderStatusEnum = pgEnum('order_status', ['paid'])
export const deliveryMethodEnum = pgEnum('delivery_method', [
  'delivery',
  'pickup',
])

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    status: orderStatusEnum('status').notNull(),
    shippingAddress: varchar('shipping_address', { length: 512 }),
    deliveryMethod: deliveryMethodEnum('delivery_method').notNull(),
    recipientName: varchar('recipient_name', { length: 128 }).notNull(),
    recipientPhone: varchar('recipient_phone', { length: 16 }).notNull(),
    total: integer('total').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check(
      'orders_delivery_consistency',
      sql`(${t.deliveryMethod} = 'pickup' AND ${t.shippingAddress} IS NULL)
          OR(
          ${t.deliveryMethod}
          =
          'delivery'
          AND
          ${t.shippingAddress}
          IS
          NOT
          NULL
          )
      `,
    ),
    check('orders_total_non_negative', sql`${t.total}
    >= 0`),
    index('orders_user_id_idx').on(t.userId),
  ],
)

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 128 }).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    imageUrl: varchar('image_url', { length: 512 }),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    price: integer('unit_price').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    unique('order_items_order_id_product_id_unique').on(
      t.orderId,
      t.productId,
    ),
    check('order_items_quantity_positive', sql`${t.quantity}
    > 0`),
    check('order_items_unit_price_non_negative', sql`${t.price}
    >= 0`),
  ],
)
