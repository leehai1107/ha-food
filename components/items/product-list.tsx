import { useCart } from "@/hooks/CartContext";
import productService from "@/services/productService";
import { Product, ProductQueryParams } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

interface ProductListProps {
  category?: string;
  searchTerm?: string;
  limit?: number;
}

const ProductList: React.FC<ProductListProps> = ({
  category,
  searchTerm,
  limit = 20,
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setLoading(true);
          // Reset products when fetching first page (new category or initial load)
          if (!append) {
            setProducts([]);
          }
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = {
          categoryId: category || undefined,
          search: searchTerm || undefined,
          limit,
          page,
          available: true,
          sortBy: "rating" as const,
          sortOrder: "desc" as const,
          includeImages: true,
        };

        const response = await productService.getProducts(params);

        if (response.success) {
          setProducts((prev) =>
            append
              ? [...prev, ...response.data.products]
              : response.data.products
          );
          setPagination({
            page: response.data.page,
            totalPages: response.data.totalPages,
            total: response.data.total,
          });
        } else {
          setError(response.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("An error occurred while fetching products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, searchTerm, limit]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset products when category or search term changes
  useEffect(() => {
    setProducts([]);
    setPagination({
      page: 1,
      totalPages: 1,
      total: 0,
    });
  }, [category, searchTerm]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numPrice);
  };

  const renderStars = (rating: string | number | null) => {
    if (!rating) return null;
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= numRating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleViewProduct = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = useCallback(
    async (product: Product, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!product.available) return;

      try {
        setAddingToCart(product.productSku);
        addToCart(product, 1);

        // Show success feedback briefly
        setTimeout(() => {
          setAddingToCart(null);
        }, 1000);
      } catch (error) {
        console.error("Error adding to cart:", error);
        setAddingToCart(null);
      }
    },
    [addToCart]
  );

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage?.imageUrl || product.images[0].imageUrl;
      return imageUrl || "/image/noimage.png";
    }
    return "/image/noimage.png";
  };

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (pagination.page < pagination.totalPages) {
      fetchProducts(pagination.page + 1, true);
    }
  };

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchProducts(1, false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          {searchTerm
            ? `Không tìm thấy sản phẩm nào cho "${searchTerm}"`
            : "Không có sản phẩm nào được tìm thấy."}
        </p>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Thử tìm kiếm với từ khóa khác hoặc duyệt qua các danh mục sản phẩm.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product) => (
          <div
            key={product.productSku}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleViewProduct(product)}
          >
            {/* Product Image */}
            <div className="relative">
              <Image
                src={getProductImage(product)}
                alt={product.productName}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              {!product.available && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  Hết hàng
                </div>
              )}
              {parseFloat(product.originalPrice) >
                parseFloat(product.currentPrice) && (
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-bold border-2 border-white shadow-lg transform rotate-3">
                  <div className="flex items-center">
                    <span className="text-xs mr-1">Giảm</span>
                    <span className="text-sm">
                      {Math.round(
                        ((parseFloat(product.originalPrice) -
                          parseFloat(product.currentPrice)) /
                          parseFloat(product.originalPrice)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.productName}
              </h3>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviewCount || 0})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-3">
                {parseFloat(product.originalPrice) >
                parseFloat(product.currentPrice) ? (
                  <div>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.currentPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.currentPrice)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {product.available ? (
                  <>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
                        addingToCart === product.productSku
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      disabled={addingToCart === product.productSku}
                    >
                      {addingToCart === product.productSku
                        ? "✓ Đã thêm!"
                        : "Thêm vào giỏ"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProduct(product);
                      }}
                      className="w-full py-2 px-4 rounded font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full py-2 px-4 rounded font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                    disabled
                  >
                    Hết hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      {pagination.totalPages > 1 && (
        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            Hiển thị {products.length} trong tổng số {pagination.total} sản phẩm
          </p>
          {pagination.page < pagination.totalPages && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tải...
                </span>
              ) : (
                "Xem Thêm"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
