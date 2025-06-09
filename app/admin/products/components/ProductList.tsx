import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (sku: string) => void;
    formatPrice: (price: string | number) => string;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, formatPrice }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
                <p className="text-gray-500 mb-4">Chưa có sản phẩm nào được tạo hoặc không có sản phẩm nào phù hợp với bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {products.map((product) => (
                <div key={product.productSku} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={(product.images.find(img => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl)}
                                    alt={product.productName}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.productName}</h3>
                                    <p className="text-sm text-gray-600 mb-2">SKU: {product.productSku}</p>

                                    {product.productDescriptions && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.productDescriptions}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500">Loại:</span>
                                            <span className="font-medium">{product.productType}</span>
                                        </div>

                                        {product.category && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Danh mục:</span>
                                                <span className="font-medium">{product.category.name}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500">Số lượng:</span>
                                            <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.quantity}
                                            </span>
                                        </div>

                                        {product.weight && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Khối lượng:</span>
                                                <span className="font-medium">{product.weight}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {product.tags && product.tags.length > 0 && (
                                        <div className="mt-3">
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {product.tags.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{product.tags.length - 3} khác
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Price and Actions */}
                                <div className="text-right ml-4">
                                    <div className="mb-3">
                                        <div className="text-lg font-bold text-red-600">
                                            {formatPrice(product.currentPrice)}
                                        </div>
                                        {product.originalPrice !== product.currentPrice && (
                                            <div className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.available ? 'Có sẵn' : 'Hết hàng'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            title="Chỉnh sửa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.productSku)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                            title="Xóa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList; 