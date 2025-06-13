"use client";
import ProductList from "@/components/items/product-list";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Client component that handles search params
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const [selectedProductType, setSelectedProductType] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [productTypes, setProductTypes] = useState<string[]>(['Tất cả']);
    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

    // Fetch product types and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product types
                const typesResponse = await productService.getProductTypes();
                if (typesResponse.success) {
                    setProductTypes(['Tất cả', ...typesResponse.data]);
                }

                // Fetch categories
                const categoriesResponse = await categoryService.getFlatCategories();
                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to default types
                setProductTypes(['Tất cả', 'Hộp Quà Tết', 'Bánh Trung Thu']);
            }
        };

        fetchData();
    }, []);

    // Handle URL parameters
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    const handleProductTypeChange = (type: string) => {
        setSelectedProductType(type === 'Tất cả' ? '' : type);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === 'Tất cả' ? '' : category);
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
                        {selectedCategory && (
                            <>
                                <span className="text-gray-500">/</span>
                                <span className="text-gray-900 font-medium">{selectedCategory}</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {selectedCategory ? selectedCategory : 'Sản phẩm'}
                        </h1>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục:
                            </label>
                            <select
                                value={selectedCategory || 'Tất cả'}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="Tất cả">Tất cả</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                    <h2 className="text-xl font-semibold mb-6">
                        {selectedCategory ? `${selectedCategory}` : 'Tất cả sản phẩm'}
                    </h2>
                    <ProductList
                        productType={selectedProductType || undefined}
                        category={selectedCategory || undefined}
                        limit={20}
                    />
                </div>
            </div>
        </>
    );
};

// Loading fallback component
const ProductsLoading = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
);

// Main page component
const ProductsPage = () => {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsContent />
        </Suspense>
    );
};

export default ProductsPage;
