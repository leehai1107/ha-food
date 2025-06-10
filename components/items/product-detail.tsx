"use client";
import { Product } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';

interface ProductDetailProps {
    product: Product;
    quantity: number;
    isInCart: boolean;
    cartItemQuantity?: number;
    addToCartMessage?: string | null;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onGoToCart: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    quantity,
    isInCart,
    cartItemQuantity = 0,
    addToCartMessage,
    onQuantityChange,
    onAddToCart,
    onGoToCart,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-2xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const images = product.images && product.images.length > 0 ? product.images.map(img => (img.imageUrl)) : [("/image/noimage.png")];

    const handleImageClick = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setModalOpen(true);
    };

    const handleThumbnailHover = (index: number) => {
        if (selectedImageIndex !== index) {
            setIsFading(true);
            setTimeout(() => {
                setSelectedImageIndex(index);
                setIsFading(false);
            }, 300);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalImageUrl(null);
    };

    return (
        <div className="container mx-auto max-w-screen-lg px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative">
                        <Image
                            src={images[selectedImageIndex]}
                            alt={product.productName}
                            width={600}
                            height={600}
                            className={`w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                            onClick={() => handleImageClick(images[selectedImageIndex])}
                        />
                        {!product.available && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                                HẾT HÀNG
                            </div>
                        )}
                        {parseFloat(product.originalPrice) > parseFloat(product.currentPrice) && (
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                                GIẢM GIÁ
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                            {images.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    width={80}
                                    height={80}
                                    alt={`${product.productName} ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${selectedImageIndex === index ? 'border-red-600' : 'border-gray-300'
                                        }`}
                                    onMouseEnter={() => handleThumbnailHover(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    {/* Product Name and SKU */}
                    <div>
                        <p className="text-gray-600 mb-2">Mã sản phẩm: <span className="font-semibold">{product.productSku}</span></p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.productName}</h1>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center space-x-4">
                            <div className="flex">{renderStars(parseFloat(product.rating))}</div>
                            <span className="text-gray-600">
                                {product.rating}/5 ({product.reviewCount || 0} đánh giá)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="space-y-2">
                        {parseFloat(product.originalPrice) > parseFloat(product.currentPrice) ? (
                            <div>
                                <span className="text-3xl font-bold text-red-600">
                                    {formatPrice(parseFloat(product.currentPrice))}
                                </span>
                                <span className="text-xl text-gray-500 line-through ml-4">
                                    {formatPrice(parseFloat(product.originalPrice))}
                                </span>
                                <div className="text-green-600 font-semibold">
                                    Tiết kiệm: {formatPrice(parseFloat(product.originalPrice) - parseFloat(product.currentPrice))}
                                </div>
                            </div>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(parseFloat(product.currentPrice))}
                            </span>
                        )}
                    </div>

                    {/* Product Type and Weight */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Loại sản phẩm:</span>
                            <span className="ml-2 font-semibold">{product.productType}</span>
                        </div>
                        {product.weight && (
                            <div>
                                <span className="text-gray-600">Trọng lượng:</span>
                                <span className="ml-2 font-semibold">{product.weight}</span>
                            </div>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="text-sm">
                        <span className="text-gray-600">Số lượng còn lại:</span>
                        <span className={`ml-2 font-semibold ${product.quantity > 10 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.quantity} sản phẩm
                        </span>
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-primary-black px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-6">
                        {/* Quantity Selector */}
                        {product.available && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng:
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => onQuantityChange(quantity - 1)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-2 text-center border-x border-gray-300 focus:outline-none"
                                                min="1"
                                                max={product.quantity}
                                            />
                                            <button
                                                onClick={() => onQuantityChange(quantity + 1)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                                                disabled={quantity >= product.quantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            (Tối đa: {product.quantity})
                                        </span>
                                    </div>
                                </div>

                                {/* Cart Status */}
                                {isInCart && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-blue-800 text-sm">
                                            ✓ Sản phẩm này đã có trong giỏ hàng ({cartItemQuantity} sản phẩm)
                                        </p>
                                    </div>
                                )}

                                {/* Add to Cart Message */}
                                {addToCartMessage && (
                                    <div className={`border rounded-lg p-3 ${addToCartMessage.includes('lỗi')
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-green-50 border-green-200 text-green-800'
                                        }`}>
                                        <p className="text-sm">{addToCartMessage}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {product.available ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={onAddToCart}
                                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                                {isInCart && (
                                    <button
                                        onClick={onGoToCart}
                                        className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                                    >
                                        XEM GIỎ HÀNG
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button
                                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold text-lg cursor-not-allowed"
                                disabled
                            >
                                HẾT HÀNG
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Details Table */}
            <div className="mt-12 overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse border border-gray-200">
                    <tbody className="text-gray-700 text-sm">
                        {/* Description */}
                        <tr className="border-b border-gray-200">
                            <th className="bg-gray-50 px-4 py-3 font-semibold w-40">Mô tả sản phẩm</th>
                            <td className="px-4 py-3">{product.productDescriptions}</td>
                        </tr>

                        {/* Content (optional) */}
                        {product.productContent && (
                            <tr className="border-b border-gray-200">
                                <th className="bg-gray-50 px-4 py-3 font-semibold">Nội dung chi tiết</th>
                                <td className="px-4 py-3">{product.productContent}</td>
                            </tr>
                        )}

                        {/* Ingredients */}
                        <tr className="border-b border-gray-200 align-top">
                            <th className="bg-gray-50 px-4 py-3 font-semibold">Nguyên liệu</th>
                            <td className="px-4 py-3">
                                <ul className="list-disc list-inside space-y-1">
                                    {product.productIngredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>

                        {/* Preserve */}
                        <tr className="border-b border-gray-200">
                            <th className="bg-gray-50 px-4 py-3 font-semibold">Bảo quản</th>
                            <td className="px-4 py-3">{product.productPreserve}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Review List */}
            <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>
                <ul className="space-y-2">
                    {product.reviews?.map((review) => (
                        <li key={review.id} className="border-b border-gray-200 pb-2">
                            <p className="font-semibold">{review.customerName}</p>
                            <div className="flex items-center space-x-1 mt-1">
                                {renderStars(parseFloat(review.rating.toString()))} <span className="text-gray-600">({review.rating})</span>
                            </div>
                            <p className="text-gray-600">{review.content}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Image Modal */}
            {modalOpen && (
                <ImageModal imageUrl={modalImageUrl!} onClose={closeModal} />
            )}
        </div>
    );
};

export default ProductDetail;

// Modal for image zoom/view
interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-primary-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 text-white text-3xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <Image src={imageUrl} width={800} height={800} alt="Zoomed Product Image" className="max-w-full max-h-screen object-contain" />
            </div>
        </div>
    );
};
