"use client";
import { useRouter } from "next/navigation";
import productService from "@/services/productService";
import { useCart } from "@/hooks/CartContext";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import ProductDetail from "@/components/items/product-detail";
import Link from "next/link";
import { use } from "react";
import Image from "next/image";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addToCart, isInCart, getCartItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartMessage, setAddToCartMessage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      try {
        const response = await productService.getProductBySlug(slug);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.message || "Failed to load product");
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        try {
          // Calculate price range (±20% of current product price)
          const currentPrice = parseFloat(product.currentPrice);
          const minPrice = currentPrice * 0.8; // 20% lower
          const maxPrice = currentPrice * 1.2; // 20% higher

          // First try to get products by price range
          const response = await productService.getProductsByPriceRange(
            minPrice,
            maxPrice
          );

          if (response.success && response.data) {
            // Filter out the current product and limit to 8 related products
            const filteredProducts = response.data.products
              .filter(
                (relatedProduct) =>
                  relatedProduct.productSku !== product.productSku
              )
              .slice(0, 8);

            if (filteredProducts.length > 0) {
              setRelatedProducts(filteredProducts);
              return;
            }
          }

          // If no products found in price range, fallback to getting products by type
          const fallbackResponse = await productService.getProductsByType(
            product.productType,
            {
              limit: 8,
              available: true,
            }
          );

          if (fallbackResponse.success && fallbackResponse.data) {
            const fallbackProducts = fallbackResponse.data.products
              .filter(
                (relatedProduct) =>
                  relatedProduct.productSku !== product.productSku
              )
              .slice(0, 8);
            setRelatedProducts(fallbackProducts);
          }
        } catch (err) {
          console.error("Failed to load related products:", err);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]); // Fetch related products when the main product is loaded

  const handleAddToCart = () => {
    if (!product || !product.available) return;

    try {
      addToCart(product, quantity);
      setAddToCartMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);

      // Clear message after 3 seconds
      setTimeout(() => {
        setAddToCartMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartMessage("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      setTimeout(() => {
        setAddToCartMessage(null);
      }, 3000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.quantity) {
      setQuantity(product.quantity);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-black">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <>
        <div className="h-24"></div>
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sản phẩm
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "Sản phẩm không tồn tại hoặc đã bị xóa."}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="bg-gray-600 text-primary-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Quay lại
              </button>
              <Link
                href="/"
                className="bg-primary text-primary-white px-6 py-3 rounded-lg hover:bg-dark-red transition-colors inline-block"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/products" className="text-red-600 hover:text-red-700">
              Sản phẩm
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">
              {product?.productName}
            </span>
          </nav>
        </div>
      </div>

      <ProductDetail
        product={product}
        quantity={quantity}
        isInCart={isInCart(product.productSku)}
        cartItemQuantity={getCartItem(product.productSku)?.quantity}
        addToCartMessage={addToCartMessage}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
        onGoToCart={handleGoToCart}
      />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sản phẩm liên quan
          </h2>
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const container = document.getElementById(
                  "related-products-container"
                );
                if (container) {
                  container.scrollBy({ left: -400, behavior: "smooth" });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous products"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                const container = document.getElementById(
                  "related-products-container"
                );
                if (container) {
                  container.scrollBy({ left: 400, behavior: "smooth" });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next products"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Products Container */}
            <div
              id="related-products-container"
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.productSku}
                  href={`/products/${relatedProduct.slug}`}
                  className="flex-none w-[calc(25%-18px)] min-w-[200px] bg-primary-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow snap-start"
                >
                  <div className="relative">
                    <Image
                      width={200}
                      height={200}
                      src={
                        relatedProduct.images?.[0]?.imageUrl ||
                        "/placeholder-image.png"
                      }
                      alt={relatedProduct.productName}
                      className="w-full h-48 object-cover"
                    />
                    {/* Discount Badge */}
                    {parseFloat(relatedProduct.originalPrice) >
                      parseFloat(relatedProduct.currentPrice) && (
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-bold border-2 border-white shadow-lg transform rotate-3">
                        <div className="flex items-center">
                          <span className="text-xs mr-1">Giảm</span>
                          <span className="text-sm">
                            {Math.round(
                              ((parseFloat(relatedProduct.originalPrice) -
                                parseFloat(relatedProduct.currentPrice)) /
                                parseFloat(relatedProduct.originalPrice)) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Out of Stock Badge */}
                    {!relatedProduct.available && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        HẾT HÀNG
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">
                      {relatedProduct.productName}
                    </h3>
                    {/* Price Display */}
                    {parseFloat(relatedProduct.originalPrice) >
                    parseFloat(relatedProduct.currentPrice) ? (
                      <div className="space-y-1">
                        <p className="text-primary font-bold text-lg">
                          {parseFloat(
                            relatedProduct.currentPrice
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </p>
                        <p className="text-gray-500 line-through text-sm">
                          {parseFloat(
                            relatedProduct.originalPrice
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </p>
                      </div>
                    ) : (
                      <p className="text-primary font-bold text-lg">
                        {parseFloat(relatedProduct.currentPrice).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VNĐ
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
