"use client";
import React, { useState, useEffect } from 'react';
import categoryService from '@/services/categoryService';
import productService from '@/services/productService';
import { productApi } from '@/services/uploadApi';
import { Category, CreateProductRequest, Product, ProductQueryParams } from '@/types';
import { Review, CreateReviewRequest } from '@/services/productService';
import slugify from 'slugify';
import ProductList from './components/ProductList';
import ProductFilters from './components/ProductFilters';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';

const ProductManagement: React.FC = () => {
    // State management
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewForm, setReviewForm] = useState<CreateReviewRequest>({
        customerName: '',
        rating: 5,
        content: '',
        productSku: ''
    });

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

    const openEditModal = async (product: Product) => {
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
        await fetchProductReviews(product.productSku);
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

    const handleAddReview = async () => {
        if (!editingProduct) return;
        
        try {
            const response = await productService.createReview(editingProduct.productSku, {
                ...reviewForm,
                productSku: editingProduct.productSku
            });
            if (response.success) {
                await fetchProductReviews(editingProduct.productSku);
                setReviewForm((prev) => ({
                    ...prev,
                    customerName: '',
                    rating: 5,
                    content: '',
                    productSku: ''
                }));
            }
        } catch (err: any) {
            setError(err.message || 'Failed to add review');
        }
    };

    const handleUpdateReview = async (reviewId: number, reviewData: Partial<CreateReviewRequest>) => {
        if (!editingProduct) return;
        
        try {
            const response = await productService.updateReview(editingProduct.productSku, reviewId, reviewData);
            if (response.success) {
                await fetchProductReviews(editingProduct.productSku);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update review');
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!editingProduct) return;
        
        try {
            const response = await productService.deleteReview(editingProduct.productSku, reviewId);
            if (response.success) {
                await fetchProductReviews(editingProduct.productSku);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete review');
        }
    };

    const fetchProductReviews = async (productSku: string) => {
        try {
            const response = await productService.getProductReviews(productSku);
            if (response.success) {
                setReviews(response.data);
            }
        } catch (err: any) {
            console.error('Failed to fetch reviews:', err);
        }
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

            {/* Filters */}
            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                categories={categories}
                totalProducts={totalProducts}
                productsLength={products.length}
                onCreateClick={() => setShowCreateModal(true)}
            />

            {/* Product List */}
            <ProductList
                products={products}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                formatPrice={formatPrice}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Create Product Modal */}
            <ProductModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    resetForm();
                }}
                onSubmit={handleCreateProduct}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                imagePreviewUrls={imagePreviewUrls}
                setImagePreviewUrls={setImagePreviewUrls}
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleImageSelect={handleImageSelect}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                removeImage={removeImage}
                tagInput={tagInput}
                setTagInput={setTagInput}
                addTag={addTag}
                removeTag={removeTag}
                ingredientInput={ingredientInput}
                setIngredientInput={setIngredientInput}
                addIngredient={addIngredient}
                removeIngredient={removeIngredient}
                isEditing={false}
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                reviews={[]}
            />

            {/* Edit Product Modal */}
            <ProductModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetForm();
                }}
                onSubmit={handleUpdateProduct}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                imagePreviewUrls={imagePreviewUrls}
                setImagePreviewUrls={setImagePreviewUrls}
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleImageSelect={handleImageSelect}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                removeImage={removeImage}
                tagInput={tagInput}
                setTagInput={setTagInput}
                addTag={addTag}
                removeTag={removeTag}
                ingredientInput={ingredientInput}
                setIngredientInput={setIngredientInput}
                addIngredient={addIngredient}
                removeIngredient={removeIngredient}
                editingProduct={editingProduct || undefined}
                isEditing={true}
                reviews={reviews}
                onAddReview={handleAddReview}
                onUpdateReview={handleUpdateReview}
                onDeleteReview={handleDeleteReview}
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
            />
        </div>
    );
};

export default ProductManagement;