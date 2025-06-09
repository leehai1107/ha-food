import React from 'react';
import { Category } from '@/types';

interface ProductFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedType: string;
    setSelectedType: (value: string) => void;
    availabilityFilter: string;
    setAvailabilityFilter: (value: string) => void;
    sortBy: 'name' | 'price' | 'createdAt' | 'rating';
    setSortBy: (value: 'name' | 'price' | 'createdAt' | 'rating') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (value: 'asc' | 'desc') => void;
    categories: Category[];
    totalProducts: number;
    productsLength: number;
    onCreateClick: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    categories,
    totalProducts,
    productsLength,
    onCreateClick
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tên sản phẩm, SKU..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id.toString()}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại sản phẩm</label>
                    <input
                        type="text"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        placeholder="Loại sản phẩm..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                {/* Availability Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Có sẵn</option>
                        <option value="false">Hết hàng</option>
                    </select>
                </div>
            </div>

            {/* Sort and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="createdAt">Ngày tạo</option>
                            <option value="name">Tên</option>
                            <option value="price">Giá</option>
                            <option value="rating">Đánh giá</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-1 text-gray-500 hover:text-gray-700"
                        >
                            <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-sm text-gray-500">
                        Hiển thị {productsLength} / {totalProducts} sản phẩm
                    </div>
                </div>

                <button
                    onClick={onCreateClick}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Thêm sản phẩm</span>
                </button>
            </div>
        </div>
    );
};

export default ProductFilters; 