import React from 'react';
import { Category, CreateProductRequest, Product } from '@/types';
import ProductForm from './ProductForm';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
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
    isEditing?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
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
    isEditing = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isEditing ? `Chỉnh sửa sản phẩm: ${editingProduct?.productName}` : 'Thêm sản phẩm mới'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="p-6">
                    <ProductForm
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
                        editingProduct={editingProduct}
                    />

                    <div className="mt-6 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal; 