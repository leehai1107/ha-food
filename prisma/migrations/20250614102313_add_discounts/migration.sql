-- CreateTable
CREATE TABLE "discounts" (
    "id" SERIAL NOT NULL,
    "product_sku" TEXT NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "discount_percent" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_discounts_product_sku" ON "discounts"("product_sku");

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "products"("product_sku") ON DELETE CASCADE ON UPDATE CASCADE;
