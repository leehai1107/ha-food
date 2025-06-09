"use client";
import categoryService from '@/services/categoryService';
import productService from '@/services/productService';
import { productApi } from '@/services/uploadApi';
import { Category, CreateProductRequest, Product, ProductQueryParams } from '@/types';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import slugify from 'slugify';

const ProductManagement: React.FC = () => {
    // State management
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Pagination and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt' | 'rating'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Form data
    const [formData, setFormData] = useState<CreateProductRequest>({
        productSku: '',
        productName: '',
        slug: '',
        quantity: 0,
        productType: '',
        originalPrice: 0,
        currentPrice: 0,
        tags: [],
        productDescriptions: '',
        productIngredients: [],
        productContent: '',
        productPreserve: '',
        available: true,
        weight: '',
        categoryId: undefined
    });

    // Form helpers
    const [tagInput, setTagInput] = useState('');
    const [ingredientInput, setIngredientInput] = useState('');

    // Image upload state
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, [currentPage, searchTerm, selectedCategory, selectedType, availabilityFilter, sortBy, sortOrder]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: ProductQueryParams = {
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                productType: selectedType || undefined,
                available: availabilityFilter ? availabilityFilter === 'true' : undefined,
                categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
                sortBy,
                sortOrder,
                includeCategory: true,
                includeImages: true
            };

            const response = await productService.getProducts(params);
            if (response.success) {
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
                setTotalProducts(response.data.total);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getFlatCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const generateSlug = (name: string, sku: string) => {
        const baseSlug = slugify(name);
        return `${baseSlug}-${sku.toLowerCase()}`;
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Add basic product data
            formDataToSend.append('productSku', formData.productSku);
            formDataToSend.append('productName', formData.productName);
            formDataToSend.append('slug', generateSlug(formData.productName, formData.productSku));
            formDataToSend.append('quantity', (Number(formData.quantity) || 0).toString());
            formDataToSend.append('productType', formData.productType);
            formDataToSend.append('originalPrice', (formData.originalPrice || 0).toString());
            formDataToSend.append('currentPrice', (formData.currentPrice || 0).toString());
            formDataToSend.append('productDescriptions', formData.productDescriptions || '');
            formDataToSend.append('productContent', formData.productContent || '');
            formDataToSend.append('productPreserve', formData.productPreserve || '');
            formDataToSend.append('available', (formData.available ?? true).toString());
            formDataToSend.append('weight', formData.weight || '');

            if (formData.categoryId) {
                formDataToSend.append('categoryId', formData.categoryId.toString());
            }

            // Add tags and ingredients as JSON
            const tags = (formData.tags || []).filter(tag => tag.trim() !== '');
            const ingredients = (formData.productIngredients || []).filter(ingredient => ingredient.trim() !== '');
            formDataToSend.append('tags', JSON.stringify(tags));
            formDataToSend.append('productIngredients', JSON.stringify(ingredients));

            // Add images
            selectedImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = selectedImages.length > 0
                ? await productApi.createWithImages(formDataToSend)
                : await productService.createProduct({
                    ...formData,
                    slug: generateSlug(formData.productName, formData.productSku),
                    tags: (formData.tags || []).filter(tag => tag.trim() !== ''),
                    productIngredients: (formData.productIngredients || []).filter(ingredient => ingredient.trim() !== ''),
                    productSKU: formData.productSku,
                    quantity: Number(formData.quantity) || 0,
                    productDescriptions: formData.productDescriptions || '',
                    productContent: formData.productContent || '',
                    productPreserve: formData.productPreserve || '',
                    weight: formData.weight || ''
                });

            if (response.success) {
                await fetchData();
                setShowCreateModal(false);
                resetForm();
                resetImageState();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create product');
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            if (selectedImages.length > 0) {
                // Update with images
                const formDataToSend = new FormData();

                // Add basic product data
                formDataToSend.append('productSku', formData.productSku);
                formDataToSend.append('productName', formData.productName);
                formDataToSend.append('slug', generateSlug(formData.productName, formData.productSku));
                formDataToSend.append('quantity', (Number(formData.quantity) || 0).toString());
                formDataToSend.append('productType', formData.productType);
                formDataToSend.append('originalPrice', (formData.originalPrice || 0).toString());
                formDataToSend.append('currentPrice', (formData.currentPrice || 0).toString());
                formDataToSend.append('productDescriptions', formData.productDescriptions || '');
                formDataToSend.append('productContent', formData.productContent || '');
                formDataToSend.append('productPreserve', formData.productPreserve || '');
                formDataToSend.append('available', (formData.available ?? true).toString());
                formDataToSend.append('weight', formData.weight || '');

                if (formData.categoryId) {
                    formDataToSend.append('categoryId', formData.categoryId.toString());
                }

                // Add tags and ingredients as JSON
                const tags = (formData.tags || []).filter(tag => tag.trim() !== '');
                const ingredients = (formData.productIngredients || []).filter(ingredient => ingredient.trim() !== '');
                formDataToSend.append('tags', JSON.stringify(tags));
                formDataToSend.append('productIngredients', JSON.stringify(ingredients));

                // Add images
                selectedImages.forEach((image) => {
                    formDataToSend.append('images', image);
                });

                const response = await productApi.updateWithImages(editingProduct.productSku, formDataToSend);
                if (response.success) {
                    await fetchData();
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetForm();
                }
            } else {
                // Update without images
                const productData = {
                    ...formData,
                    slug: generateSlug(formData.productName, formData.productSku),
                    tags: (formData.tags || []).filter(tag => tag.trim() !== ''),
                    productIngredients: (formData.productIngredients || []).filter(ingredient => ingredient.trim() !== ''),
                    categoryId: formData.categoryId || undefined,
                    quantity: Number(formData.quantity) || 0,
                    productDescriptions: formData.productDescriptions || '',
                    productContent: formData.productContent || '',
                    productPreserve: formData.productPreserve || '',
                    weight: formData.weight || ''
                };

                const response = await productService.updateProduct(editingProduct.productSku, productData);
                if (response.success) {
                    await fetchData();
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetForm();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async (sku: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

        try {
            const response = await productService.deleteProduct(sku);
            if (response.success) {
                await fetchData();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            productSku: product.productSku,
            productName: product.productName,
            slug: product.slug || generateSlug(product.productName, product.productSku),
            quantity: product.quantity,
            productType: product.productType,
            originalPrice: typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice,
            currentPrice: typeof product.currentPrice === 'string' ? parseFloat(product.currentPrice) : product.currentPrice,
            tags: product.tags || [],
            productDescriptions: product.productDescriptions || '',
            productIngredients: product.productIngredients || [],
            productContent: product.productContent || '',
            productPreserve: product.productPreserve || '',
            available: product.available,
            weight: product.weight || '',
            categoryId: product.categoryId || undefined
        });
        // Clear image upload state when opening edit modal
        resetImageState();
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            productSku: '',
            productName: '',
            slug: '',
            quantity: 0,
            productType: '',
            originalPrice: 0,
            currentPrice: 0,
            tags: [],
            productDescriptions: '',
            productIngredients: [],
            productContent: '',
            productPreserve: '',
            available: true,
            weight: '',
            categoryId: undefined
        });
        setTagInput('');
        setIngredientInput('');
        resetImageState();
    };

    const addTag = () => {
        if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: (prev.tags || []).filter((_, i) => i !== index)
        }));
    };

    const addIngredient = () => {
        if (ingredientInput.trim() && !(formData.productIngredients || []).includes(ingredientInput.trim())) {
            setFormData(prev => ({
                ...prev,
                productIngredients: [...(prev.productIngredients || []), ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    const removeIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            productIngredients: (prev.productIngredients || []).filter((_, i) => i !== index)
        }));
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numPrice);
    };

    // Image upload handlers
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addImages(files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    };

    const addImages = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            alert('Vui lòng chọn file hình ảnh hợp lệ');
            return;
        }

        const totalImages = selectedImages.length + imageFiles.length;
        if (totalImages > 10) {
            alert('Tối đa 10 hình ảnh cho mỗi sản phẩm');
            return;
        }

        // Check file sizes
        const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('Kích thước file không được vượt quá 5MB');
            return;
        }

        setSelectedImages(prev => [...prev, ...imageFiles]);

        // Create preview URLs
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const resetImageState = () => {
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setDragOver(false);
    };

    if (loading && products.length === 0) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h2>
                <p className="text-gray-600">Quản lý tất cả sản phẩm trong hệ thống</p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-xl mr-3">⚠️</span>
                        <div>
                            <p className="font-medium">Có lỗi xảy ra</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
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
                            Hiển thị {products.length} / {totalProducts} sản phẩm
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Thêm sản phẩm</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
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
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.available ? 'Có sẵn' : 'Hết hàng'}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="Chỉnh sửa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.productSku)}
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

                {products.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
                        <p className="text-gray-500 mb-4">Chưa có sản phẩm nào được tạo hoặc không có sản phẩm nào phù hợp với bộ lọc.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Tạo sản phẩm đầu tiên
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Trước
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                            if (pageNum > totalPages) return null;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === pageNum
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {/* Create Product Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Thêm sản phẩm mới</h3>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateProduct} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Thông tin cơ bản</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productSku}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productSku: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="VD: SP001"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Tên sản phẩm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productType}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="VD: Hộp quà Tết"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                                        <select
                                            value={formData.categoryId || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số lượng <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Khối lượng</label>
                                            <input
                                                type="text"
                                                value={formData.weight || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="VD: 500g"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá gốc (VND) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.originalPrice}
                                                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá bán (VND) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.currentPrice}
                                                onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="available"
                                            checked={formData.available}
                                            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                                            Sản phẩm có sẵn
                                        </label>
                                    </div>
                                </div>

                                {/* Detailed Information */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Thông tin chi tiết</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                                        <textarea
                                            value={formData.productDescriptions || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productDescriptions: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Mô tả ngắn về sản phẩm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung sản phẩm</label>
                                        <textarea
                                            value={formData.productContent || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productContent: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Nội dung chi tiết về sản phẩm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn bảo quản</label>
                                        <textarea
                                            value={formData.productPreserve || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productPreserve: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Hướng dẫn bảo quản sản phẩm"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="Nhập tag và nhấn Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData.tags || []).map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(index)}
                                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ingredients */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Thành phần</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={ingredientInput}
                                                onChange={(e) => setIngredientInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="Nhập thành phần và nhấn Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={addIngredient}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {(formData.productIngredients || []).map((ingredient, index) => (
                                                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                                                    <span className="text-sm text-green-800">{ingredient}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIngredient(index)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-4">Hình ảnh sản phẩm</h4>

                                <div
                                    className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
                  `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('image-upload-create')?.click()}
                                >
                                    <div className="space-y-2">
                                        <svg
                                            className="w-8 h-8 text-gray-400 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-600">
                                            Kéo thả hoặc click để chọn hình ảnh
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF tối đa 5MB mỗi file (tối đa 10 hình)
                                        </p>
                                    </div>
                                </div>

                                <input
                                    id="image-upload-create"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />

                                {/* Image Previews */}
                                {imagePreviewUrls.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-24 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                        Chính
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Tạo sản phẩm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa sản phẩm: {editingProduct.productName}</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingProduct(null);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Thông tin cơ bản</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productSku}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productSku: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="VD: SP001"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Tên sản phẩm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productType}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="VD: Hộp quà Tết"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                                        <select
                                            value={formData.categoryId || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số lượng <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Khối lượng</label>
                                            <input
                                                type="text"
                                                value={formData.weight || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="VD: 500g"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá gốc (VND) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.originalPrice}
                                                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giá bán (VND) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.currentPrice}
                                                onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="available-edit"
                                            checked={formData.available}
                                            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="available-edit" className="ml-2 block text-sm text-gray-900">
                                            Sản phẩm có sẵn
                                        </label>
                                    </div>
                                </div>

                                {/* Detailed Information */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Thông tin chi tiết</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
                                        <textarea
                                            value={formData.productDescriptions || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productDescriptions: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Mô tả ngắn về sản phẩm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung sản phẩm</label>
                                        <textarea
                                            value={formData.productContent || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productContent: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Nội dung chi tiết về sản phẩm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn bảo quản</label>
                                        <textarea
                                            value={formData.productPreserve || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, productPreserve: e.target.value }))}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Hướng dẫn bảo quản sản phẩm"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="Nhập tag và nhấn Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(formData.tags || []).map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(index)}
                                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ingredients */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Thành phần</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={ingredientInput}
                                                onChange={(e) => setIngredientInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="Nhập thành phần và nhấn Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={addIngredient}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {(formData.productIngredients || []).map((ingredient, index) => (
                                                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                                                    <span className="text-sm text-green-800">{ingredient}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIngredient(index)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Images Section */}
                            {editingProduct.images && editingProduct.images.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-4">Hình ảnh hiện tại</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {editingProduct.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={(image.imageUrl)}
                                                    alt={`Product image ${index + 1}`}
                                                    width={200}
                                                    height={100}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                {image.isPrimary && (
                                                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                        Chính
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Để thay đổi hình ảnh, hãy tải lên hình ảnh mới bên dưới. Hình ảnh mới sẽ thay thế toàn bộ hình ảnh hiện tại.
                                    </p>
                                </div>
                            )}

                            {/* Image Upload Section */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-4">
                                    {editingProduct.images && editingProduct.images.length > 0 ? 'Thay đổi hình ảnh' : 'Thêm hình ảnh'}
                                </h4>

                                <div
                                    className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
                  `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('image-upload-edit')?.click()}
                                >
                                    <div className="space-y-2">
                                        <svg
                                            className="w-8 h-8 text-gray-400 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-600">
                                            Kéo thả hoặc click để chọn hình ảnh mới
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF tối đa 5MB mỗi file (tối đa 10 hình)
                                        </p>
                                    </div>
                                </div>

                                <input
                                    id="image-upload-edit"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />

                                {/* Selected Images Preview */}
                                {imagePreviewUrls.length > 0 && (
                                    <div className="mt-4">
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh đã chọn:</h5>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {imagePreviewUrls.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                    {index === 0 && (
                                                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                            Chính
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingProduct(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Cập nhật sản phẩm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;