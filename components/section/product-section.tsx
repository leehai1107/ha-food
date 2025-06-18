"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import categoryService from "@/services/categoryService";
import { Category, Product } from "@/types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

const ProductsSection = () => {
  const router = useRouter();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    Category[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories with their products
      const response = await categoryService.getHierarchicalCategories(true);
      if (response.success) {
        // Flatten the category structure and filter out categories with no products
        const flattenedCategories = response.data.reduce((acc, category) => {
          // Add parent category if it has products
          if (category.products && category.products.length > 0) {
            acc.push(category);
          }

          // Add subcategories that have products
          if (category.children) {
            const subcategoriesWithProducts = category.children.filter(
              (child) => child.products && child.products.length > 0
            );
            acc.push(...subcategoriesWithProducts);
          }

          return acc;
        }, [] as Category[]);

        setCategoriesWithProducts(flattenedCategories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

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
          className={`text-sm ${
            i <= numRating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage?.imageUrl || product.images[0].imageUrl;
      return imageUrl || "/image/noimage.png";
    }
    return "/image/noimage.png";
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/products?category=${category.id}`);
  };

  return (
    <section className="bg-white" id="products">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
          Chúng tôi chỉ phục vụ những gì tốt nhất cho bạn
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-primary">
          Khám phá bộ sưu tập sản phẩm đa dạng và chất lượng cao
        </p>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Trending Categories Section */}
        <div className="max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading capitalize">
              Danh mục phổ biến
            </h2>
            <Link
              href="/products"
              className="text-lg font-semibold text-primary border-b-2 border-primary hover:text-secondary transition-colors"
            >
              Xem thêm
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={32}
                slidesPerView={2}
                navigation
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                className="category-swiper"
              >
                {categoriesWithProducts.map((cat) => (
                  <SwiperSlide key={cat.id}>
                    <div
                      className="flex flex-col items-center group cursor-pointer"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white mb-4 relative transition-transform group-hover:scale-105">
                        <Image
                          src={cat.imageUrl || "/image/noimage.png"}
                          alt={cat.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {cat.name}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-20">
            {categoriesWithProducts.map((category) => (
              <div key={category.id} className="max-w-7xl mx-auto">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-primary font-heading">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="bg-primary text-white px-6 py-2 rounded-theme font-semibold hover:bg-secondary transition-colors font-primary"
                  >
                    Xem thêm
                  </button>
                </div>

                {/* Products Grid */}
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 4,
                      },
                    }}
                    className="products-swiper"
                  >
                    {category.products?.map((product) => (
                      <SwiperSlide key={product.productSku}>
                        <div
                          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
                          style={{ borderRadius: "var(--border-radius)" }}
                          onClick={() => handleViewProduct(product)}
                        >
                          <div className="relative h-48 overflow-hidden group">
                            <Image
                              src={getProductImage(product)}
                              alt={product.productName}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative"
                            />

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

                            <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProduct(product);
                                }}
                                className="bg-white text-primary px-6 py-2 rounded-theme font-semibold hover:bg-secondary hover:text-white transition-colors font-primary"
                              >
                                Xem chi tiết
                              </button>
                            </div>
                            {!product.available && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                Hết hàng
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="text-gray-800 font-semibold leading-tight mb-2 font-heading">
                              {product.productName}
                            </h4>
                            <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1 font-primary">
                              {product.productType}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm">
                                {product.rating && (
                                  <div className="flex items-center">
                                    {renderStars(product.rating)}
                                    <span className="ml-1 text-gray-600 font-primary">
                                      ({product.reviewCount})
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary font-primary">
                                  {formatPrice(product.currentPrice)}
                                </div>
                                {parseFloat(product.originalPrice) >
                                  parseFloat(product.currentPrice) && (
                                  <div className="text-xs text-gray-500 line-through font-primary">
                                    {formatPrice(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
