import React, { useState } from 'react';
import Image from 'next/image';
import { Category, CreateProductRequest, Product } from '@/types';
import { CreateReviewRequest, Review } from '@/services/productService';

interface ProductFormProps {
    formData: CreateProductRequest;
    setFormData: (data: CreateProductRequest) => void;
    categories: Category[];
    selectedImages: File[];
    setSelectedImages: (images: File[]) => void;
    imagePreviewUrls: string[];
    setImagePreviewUrls: (urls: string[]) => void;
    dragOver: boolean;
    setDragOver: (value: boolean) => void;
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    removeImage: (index: number) => void;
    tagInput: string;
    setTagInput: (value: string) => void;
    addTag: () => void;
    removeTag: (index: number) => void;
    ingredientInput: string;
    setIngredientInput: (value: string) => void;
    addIngredient: () => void;
    removeIngredient: (index: number) => void;
    editingProduct?: Product;
    reviews?: Review[];
    onAddReview?: (review: CreateReviewRequest) => void;
    onUpdateReview?: (reviewId: number, review: Partial<CreateReviewRequest>) => void;
    onDeleteReview?: (reviewId: number) => void;
    isEditing?: boolean;
    reviewForm: CreateReviewRequest;
    setReviewForm: (form: CreateReviewRequest | ((prev: CreateReviewRequest) => CreateReviewRequest)) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    formData,
    setFormData,
    categories,
    selectedImages,
    setSelectedImages,
    imagePreviewUrls,
    setImagePreviewUrls,
    dragOver,
    setDragOver,
    handleImageSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    ingredientInput,
    setIngredientInput,
    addIngredient,
    removeIngredient,
    editingProduct,
    reviews,
    onAddReview,
    onUpdateReview,
    onDeleteReview,
    isEditing,
    reviewForm,
    setReviewForm
}) => {
    const handleAddReview = () => {
        if (!reviewForm.customerName || !reviewForm.content || reviewForm.rating === 0) {
            alert('Vui lòng điền đầy đủ thông tin đánh giá');
            return;
        }
        if (onAddReview) {
            onAddReview({ ...reviewForm, productSku: formData.productSku });
            setReviewForm({ customerName: '', rating: 0, content: '', productSku: formData.productSku });
        }else{
            console.log("onAddReview function is not provided");
        }
    };

    const handleEditReview = (review: Review) => {
        if (onUpdateReview) {
            onUpdateReview(review.id, review);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Thông tin cơ bản</h4>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU sản phẩm <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.productSku}
                        onChange={(e) => setFormData({ ...formData, productSku: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="VD: SP001"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sản phẩm <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Tên sản phẩm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại sản phẩm <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="VD: Hộp quà Tết"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                            Số lượng <span className="text-primary">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Khối lượng</label>
                        <input
                            type="text"
                            value={formData.weight || ''}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="VD: 500g"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá bán (VND) <span className="text-primary">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá khuyến mãi (VND) <span className="text-primary">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.currentPrice}
                            onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="available"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-primary border-gray-300 rounded"
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
                        onChange={(e) => setFormData({ ...formData, productDescriptions: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Mô tả ngắn về sản phẩm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung sản phẩm</label>
                    <textarea
                        value={formData.productContent || ''}
                        onChange={(e) => setFormData({ ...formData, productContent: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Nội dung chi tiết về sản phẩm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn bảo quản</label>
                    <textarea
                        value={formData.productPreserve || ''}
                        onChange={(e) => setFormData({ ...formData, productPreserve: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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

            {/* Current Images Section */}
            {editingProduct?.images && editingProduct.images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4">Hình ảnh hiện tại</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {editingProduct.images.map((image, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={image.imageUrl}
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
            <div className="mt-6 pt-6 border-t border-gray-200 col-span-2">
                <h4 className="font-medium text-gray-900 mb-4">
                    {editingProduct?.images && editingProduct.images.length > 0 ? 'Thay đổi hình ảnh' : 'Thêm hình ảnh'}
                </h4>

                <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${dragOver ? 'border-primary bg-red-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
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
                    id="image-upload"
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
                                    <Image
                                        width={200}
                                        height={200}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
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

            {/* Reviews Section - Only show in edit mode */}
            {isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200 col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4">Đánh giá sản phẩm</h4>
                    
                    {/* Add Review Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Thêm đánh giá mới</h5>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên khách hàng <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={reviewForm.customerName}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, customerName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Tên khách hàng"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá <span className="text-primary">*</span>
                                </label>
                                <select
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>
                                            {rating} sao
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đánh giá <span className="text-primary">*</span>
                                </label>
                                <textarea
                                    value={reviewForm.content}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Nội dung đánh giá"
                                />
                            </div>
                            
                            <button
                                type="button"
                                onClick={handleAddReview}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Thêm đánh giá
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {reviews && reviews.length > 0 && (
                        <div className="space-y-4">
                            <h5 className="text-sm font-medium text-gray-700">Danh sách đánh giá</h5>
                            {reviews.map((review) => (
                                <div key={review.id} className="p-4 bg-white border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h6 className="font-medium text-gray-900">{review.customerName}</h6>
                                            <div className="flex items-center text-yellow-400">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditReview(review)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteReview?.(review.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.content}</p>
                                    <p className="text-gray-400 text-xs mt-2">
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductForm; 