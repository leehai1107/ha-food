"use client";
import ProductList from "@/components/items/product-list";
import productService from "@/services/productService";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProductsPage = () => {
    const [selectedProductType, setSelectedProductType] = useState<string>('');
    const [productTypes, setProductTypes] = useState<string[]>(['Tất cả']);


    // Fetch product types from API
    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await productService.getProductTypes();
                if (response.success) {
                    setProductTypes(['Tất cả', ...response.data]);
                }
            } catch (error) {
                console.error('Error fetching product types:', error);
                // Fallback to default types
                setProductTypes(['Tất cả', 'Hộp Quà Tết', 'Bánh Trung Thu']);
            }
        };

        fetchProductTypes();
    }, []);

    const handleProductTypeChange = (type: string) => {
        setSelectedProductType(type === 'Tất cả' ? '' : type);
    };

    return (
        <>

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-red-600 hover:text-red-700">Trang chủ</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-900 font-medium">Sản phẩm</span>
                    </nav>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sản phẩm</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Khám phá bộ sưu tập sản phẩm chất lượng cao từ HA Food
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Bộ lọc sản phẩm</h2>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại sản phẩm:
                            </label>
                            <select
                                value={selectedProductType || 'Tất cả'}
                                onChange={(e) => handleProductTypeChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                {productTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product List - ONLY ONE API CALL */}
                <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                    <h2 className="text-xl font-semibold mb-6">
                        {selectedProductType ? `${selectedProductType}` : 'Tất cả sản phẩm'}
                    </h2>
                    <ProductList
                        productType={selectedProductType || undefined}
                        limit={20}
                    />
                </div>
            </div>
        </>
    );
};

export default ProductsPage;
