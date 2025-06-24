"use client";
import ProductList from "@/components/items/product-list";
import categoryService from "@/services/categoryService";
import Link from "next/link";
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Client component that handles search params
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; _count?: { products: number } }>
  >([]);
  const isInitialLoad = useRef(true);
  const isUserTyping = useRef(false);
  const lastUrlSearch = useRef<string>("");
  const [ready, setReady] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await categoryService.getFlatCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        console.error("Failed to fetch categories:", response.message);
        // Set some fallback categories for testing
        setCategories([
          { id: 1, name: "Bánh Trung Thu", _count: { products: 21 } },
          { id: 3, name: "Thiên Hương Nguyệt Dạ", _count: { products: 14 } },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to default categories for testing
      setCategories([
        { id: 1, name: "Bánh Trung Thu", _count: { products: 21 } },
        { id: 3, name: "Thiên Hương Nguyệt Dạ", _count: { products: 14 } },
      ]);
    }
  }, []);

  // Fetch product types and categories from API
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId");
    const searchFromUrl = searchParams.get("search");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("");
    }

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
      setDebouncedSearchTerm(searchFromUrl);
      lastUrlSearch.current = searchFromUrl;
    } else {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      lastUrlSearch.current = "";
    }

    // Mark initial load as complete
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
    setReady(true);
  }, [searchParams]);

  // Debounce search term with 500ms delay
  useEffect(() => {
    // Only debounce if user is typing (not on initial load)
    if (!isInitialLoad.current) {
      isUserTyping.current = true;
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        isUserTyping.current = false;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Update URL when debounced search term changes (but not on initial load or when coming from URL)
  useEffect(() => {
    // Skip if this is initial load or if the change is from URL navigation
    if (isInitialLoad.current || !isUserTyping.current) {
      return;
    }

    // Skip if the search term is the same as what's already in the URL
    if (debouncedSearchTerm === lastUrlSearch.current) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    // Clear categoryId when searching
    if (debouncedSearchTerm) {
      params.delete("categoryId");
      setSelectedCategory("");
    }

    // Update the URL using replace to avoid adding to browser history
    const newUrl = `/products?${params.toString()}`;
    router.replace(newUrl);
    lastUrlSearch.current = debouncedSearchTerm;
  }, [debouncedSearchTerm, router, searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    // Clear search when changing category
    params.delete("search");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    lastUrlSearch.current = "";

    // Update the URL without causing a full page reload
    router.replace(`/products?${params.toString()}`);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // Don't update URL immediately - let the debounce handle it
  };

  // Get category name for display
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return "Tất cả";
    // Support comma-separated IDs
    const ids = categoryId.split(",").map((id) => id.trim());
    if (ids.length === 1) {
      const category = categories.find((c) => c.id.toString() === ids[0]);
      return category ? category.name : "Tất cả";
    }
    // If multiple, show parent name or a generic label
    // Try to find the parent (first ID)
    const parent = categories.find((c) => c.id.toString() === ids[0]);
    return parent
      ? `${parent.name} (và các sản phẩm tương tự)`
      : "Nhiều danh mục";
  };

  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto ">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Sản phẩm</span>
            {selectedCategory && (
              <>
                <span className="text-gray-500">/</span>
                <span className="text-gray-900 font-medium">
                  {getCategoryName(selectedCategory)}
                </span>
              </>
            )}
            {debouncedSearchTerm && (
              <>
                <span className="text-gray-500">/</span>
                <span className="text-gray-900 font-medium">
                  Tìm kiếm: {debouncedSearchTerm}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Bộ lọc sản phẩm</h2>
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  </div>
                )}
              </div>
              {searchTerm !== debouncedSearchTerm && (
                <p className="text-xs text-gray-500 mt-1">Đang tìm kiếm...</p>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục:
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tất cả</option>
                {categories
                  .filter((category) => (category._count?.products ?? 0) > 0)
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
            {debouncedSearchTerm
              ? `Kết quả tìm kiếm cho "${debouncedSearchTerm}"`
              : selectedCategory
              ? getCategoryName(selectedCategory)
              : "Tất cả sản phẩm"}
          </h2>
          {ready && (
            <ProductList
              category={selectedCategory || undefined}
              searchTerm={debouncedSearchTerm || undefined}
              limit={20}
            />
          )}
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
