import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "./products.js";

export const promos = pgTable("promos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  // Один товар — одно промо: на этом держится идемпотентность сидов
  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  // Порядок показа на главной
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
