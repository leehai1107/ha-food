"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import categoryService from '@/services/categoryService';
import { Category, Product } from '@/types';
import Image from 'next/image';

const ProductsSection = () => {
  const router = useRouter();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<Category[]>([]);
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
        setCategoriesWithProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  const renderStars = (rating: string | number | null) => {
    if (!rating) return null;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-sm ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getProductImage = (product: Product) => {
    console.log("Product Images:", product.images);
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary);
      const imageUrl = primaryImage?.imageUrl || product.images[0].imageUrl;
      return imageUrl || "/image/noimage.png";
    }
    return "/image/noimage.png";
  };

  const getCategoryImage = (category: Category) => {
    return category.imageUrl || "/image/noimage.png";
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <section className="py-20 bg-white" id="products">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
            Chúng tôi chỉ phục vụ những gì tốt nhất cho bạn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-primary">
            Khám phá bộ sưu tập sản phẩm đa dạng và chất lượng cao
          </p>
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
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary font-heading">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 font-primary">
                        {category.description || 'Khám phá các sản phẩm chất lượng cao trong danh mục này.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="bg-primary text-white px-6 py-2 rounded-theme font-semibold hover:bg-secondary transition-colors font-primary"
                  >
                    Xem tất cả
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.products?.map((product) => (
                    <div
                      key={product.productSku}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      style={{ borderRadius: 'var(--border-radius)' }}
                      onClick={() => handleViewProduct(product)}
                    >
                      <div className="relative h-48 overflow-hidden group">
                        <Image
                          src={getProductImage(product)}
                          alt={product.productName}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
                        <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1 font-primary">
                          {product.productType}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 font-primary">Mã: {product.productSku}</p>
                        <h4 className="text-gray-800 font-semibold leading-tight mb-2 font-heading">
                          {product.productName}
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {product.rating && (
                              <div className="flex items-center">
                                {renderStars(product.rating)}
                                <span className="ml-1 text-gray-600 font-primary">({product.reviewCount})</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary font-primary">
                              {formatPrice(product.currentPrice)}
                            </div>
                            {parseFloat(product.originalPrice) > parseFloat(product.currentPrice) && (
                              <div className="text-xs text-gray-500 line-through font-primary">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsSection;
