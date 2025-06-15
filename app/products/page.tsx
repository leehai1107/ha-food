"use client";
import ProductList from "@/components/items/product-list";
import categoryService from "@/services/categoryService";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Client component that handles search params
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<Array<{ id: number; name: string; _count?: { products: number } }>>([]);

    // Fetch product types and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await categoryService.getFlatCategories();
                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to default types
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

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    // Get category name for display
    const getCategoryName = (categoryId: string) => {
        if (!categoryId) return 'Tất cả';
        const category = categories.find(c => c.id.toString() === categoryId);
        return category ? category.name : 'Tất cả';
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
                                <span className="text-gray-900 font-medium">{getCategoryName(selectedCategory)}</span>
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
                            {selectedCategory ? getCategoryName(selectedCategory) : 'Sản phẩm'}
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
                                Danh mục:
                            </label>
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="">Tất cả</option>
                                {categories
                                    .filter(category => (category._count?.products ?? 0) > 0)
                                    .map((category) => (
                                        <option key={category.id} value={category.id}>
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
                        {selectedCategory ? getCategoryName(selectedCategory) : 'Tất cả sản phẩm'}
                    </h2>
                    <ProductList
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
