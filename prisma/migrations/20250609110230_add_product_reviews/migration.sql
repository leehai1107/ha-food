-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "product_sku" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_reviews_product_sku" ON "reviews"("product_sku");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "products"("product_sku") ON DELETE CASCADE ON UPDATE CASCADE;
