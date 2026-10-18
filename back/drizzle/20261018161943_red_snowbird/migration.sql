CREATE TABLE "promos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(128) NOT NULL,
	"description" varchar(256) NOT NULL,
	"product_id" uuid NOT NULL UNIQUE,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "promos" ADD CONSTRAINT "promos_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;