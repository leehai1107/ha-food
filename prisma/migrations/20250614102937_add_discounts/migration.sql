/*
  Warnings:

  - You are about to drop the column `product_sku` on the `discounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "discounts" DROP CONSTRAINT "discounts_product_sku_fkey";

-- DropIndex
DROP INDEX "idx_discounts_product_sku";

-- AlterTable
ALTER TABLE "discounts" DROP COLUMN "product_sku";
