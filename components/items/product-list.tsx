import { useCart } from '@/hooks/CartContext';
import productService from '@/services/productService';
import { Product } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';


interface ProductListProps {
    productType?: string;
    category?: string;
    limit?: number;
}

const ProductList: React.FC<ProductListProps> = ({ productType, category, limit = 20 }) => {
    const router = useRouter();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await productService.getProducts({
                productType,
                category,
                limit,
                page: 1,
                available: true,
                sortBy: 'rating',
                sortOrder: 'desc',
                includeImages: true
            });

            if (response.success) {
                setProducts(response.data.products);
                setPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    total: response.data.total
                });
            } else {
                setError(response.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError('An error occurred while fetching products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [productType, category, limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
                    className={`text-lg ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}
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

    const handleAddToCart = useCallback(async (product: Product, e: React.MouseEvent) => {
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
            console.error('Error adding to cart:', error);
            setAddingToCart(null);
        }
    }, [addToCart]);

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary);
            const imageUrl = primaryImage?.imageUrl || product.images[0].imageUrl;
            return imageUrl || "/image/noimage.png";
        }
        return "/image/noimage.png";
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
                    onClick={fetchProducts}
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
                <p className="text-gray-600">Không có sản phẩm nào được tìm thấy.</p>
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
                            {parseFloat(product.originalPrice) > parseFloat(product.currentPrice) && (
                                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                                    Giảm giá
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            {/* Product SKU */}
                            <p className="text-sm text-gray-500 mb-1">Mã: {product.productSku}</p>

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

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.productDescriptions}
                            </p>

                            {/* Price */}
                            <div className="mb-3">
                                {parseFloat(product.originalPrice) > parseFloat(product.currentPrice) ? (
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

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {product.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {product.tags.length > 2 && (
                                    <span className="text-gray-500 text-xs">
                                        +{product.tags.length - 2} khác
                                    </span>
                                )}
                            </div>

                            {/* Weight */}
                            {product.weight && (
                                <p className="text-sm text-gray-600 mb-3">
                                    Trọng lượng: {product.weight}
                                </p>
                            )}

                            {/* Quantity */}
                            <p className="text-sm text-gray-600 mb-3">
                                Còn lại: {product.quantity} sản phẩm
                            </p>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                {product.available ? (
                                    <>
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className={`w-full py-2 px-4 rounded font-semibold transition-colors ${addingToCart === product.productSku
                                                ? 'bg-green-600 text-white'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                            disabled={addingToCart === product.productSku}
                                        >
                                            {addingToCart === product.productSku ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
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
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Hiển thị {products.length} trong tổng số {pagination.total} sản phẩm
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
