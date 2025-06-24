"use client";
import { Product } from "@/types";
import { Discount } from "@/types/product";
import { getDiscounts } from "@/services/productService";
import Image from "next/image";
import React, { useState, useEffect } from "react";

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
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getDiscounts();
        if (response.success) {
          setDiscounts(response.data);
        }
      } catch (err) {
        console.error("Failed to load discounts:", err);
      }
    };

    fetchDiscounts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-2xl ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.imageUrl)
      : ["/image/noimage.webp"];

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

  const calculateDiscountedPrice = (quantity: number) => {
    if (!discounts || discounts.length === 0) {
      return parseFloat(product.currentPrice);
    }

    const applicableDiscount = discounts
      .filter((d) => d.isActive && quantity >= d.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    if (!applicableDiscount) {
      return parseFloat(product.currentPrice);
    }

    const originalPrice = parseFloat(product.currentPrice);
    const discountAmount =
      originalPrice * (applicableDiscount.discountPercent / 100);
    return originalPrice - discountAmount;
  };

  const getApplicableDiscount = (quantity: number) => {
    if (!discounts || discounts.length === 0) {
      return null;
    }

    return discounts
      .filter((d) => d.isActive && quantity >= d.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-6 lg:px-2 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="lg:relative w-full h-96 lg:h-[500px]">
            {/* Mobile image */}
            <div className="block sm:hidden w-full h-full">
              <Image
                src={images[selectedImageIndex]}
                alt={product.productName}
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer transition-opacity duration-300"
                onClick={() => handleImageClick(images[selectedImageIndex])}
              />
            </div>

            {/* Desktop image (absolute + fill) */}
            <div className="hidden sm:block relative w-full h-full">
              <Image
                src={images[selectedImageIndex]}
                alt={product.productName}
                fill
                className={`absolute object-cover rounded-lg shadow-lg cursor-pointer transition-opacity duration-300 ${
                  isFading ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => handleImageClick(images[selectedImageIndex])}
              />
            </div>
            {!product.available && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                HẾT HÀNG
              </div>
            )}
            {parseFloat(product.originalPrice) >
              parseFloat(product.currentPrice) && (
              <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-md text-sm font-bold border-2 border-white shadow-lg transform rotate-3">
                <div className="flex items-center">
                  <span className="text-xs mr-1">Giảm</span>
                  <span className="text-lg">
                    {Math.round(
                      ((parseFloat(product.originalPrice) -
                        parseFloat(product.currentPrice)) /
                        parseFloat(product.originalPrice)) *
                        100
                    )}
                    %
                  </span>
                </div>
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
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                    selectedImageIndex === index
                      ? "border-red-600"
                      : "border-gray-300"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.productName}
            </h1>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-4">
              <div className="flex">
                {renderStars(parseFloat(product.rating))}
              </div>
              <span className="text-gray-600">
                {product.rating}/5 ({product.reviewCount || 0} đánh giá)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            {parseFloat(product.originalPrice) >
            parseFloat(product.currentPrice) ? (
              <div>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(parseFloat(product.currentPrice))}
                </span>
                <span className="text-xl text-gray-500 line-through ml-4">
                  {formatPrice(parseFloat(product.originalPrice))}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(parseFloat(product.currentPrice))}
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="text-sm">
            <span className="text-gray-600">Số lượng còn lại:</span>
            <span
              className={`ml-2 font-semibold ${
                product.quantity > 10 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity} sản phẩm
            </span>
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
                        onChange={(e) =>
                          onQuantityChange(parseInt(e.target.value) || 1)
                        }
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
                      ✓ Sản phẩm này đã có trong giỏ hàng ({cartItemQuantity}{" "}
                      sản phẩm)
                    </p>
                  </div>
                )}

                {/* Add to Cart Message */}
                {addToCartMessage && (
                  <div
                    className={`border rounded-lg p-3 ${
                      addToCartMessage.includes("lỗi")
                        ? "bg-red-50 border-red-200 text-red-800"
                        : "bg-green-50 border-green-200 text-green-800"
                    }`}
                  >
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
          <tbody className="text-gray-700 text-lg">
            {/* Description */}
            <tr className="border-b border-gray-200">
              <th className="bg-gray-50 px-4 py-3 font-semibold w-40">
                Mô tả sản phẩm
              </th>
              <td className="px-4 py-3">{product.productDescriptions}</td>
            </tr>

            {/* Content (optional) */}
            {product.productContent && (
              <tr className="border-b border-gray-200">
                <th className="bg-gray-50 px-4 py-3 font-semibold">
                  Nội dung chi tiết
                </th>
                <td className="px-4 py-3">{product.productContent}</td>
              </tr>
            )}

            {/* Ingredients */}
            <tr className="border-b border-gray-200 align-top">
              <th className="bg-gray-50 px-4 py-3 font-semibold">
                Nguyên liệu
              </th>
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

      {/* Bulk Discounts */}
      {discounts.length > 0 && (
        <div className="flex flex-col text-xl">
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl text-center font-semibold mb-4">
              Chiết khấu doanh nghiệp
            </h3>
            <div className="space-y-2">
              {discounts
                .filter((d) => d.isActive)
                .sort((a, b) => a.minQuantity - b.minQuantity)
                .map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600">
                      Từ {discount.minQuantity} sản phẩm
                    </span>
                    <span className="font-semibold text-green-600">
                      {discount.discountPercent}% chiết khấu
                    </span>
                  </div>
                ))}
            </div>
            {getApplicableDiscount(quantity) && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Your current quantity qualifies for{" "}
                  {getApplicableDiscount(quantity)?.discountPercent}% off!
                </p>
                <p className="text-green-800 font-semibold mt-1">
                  Discounted price:{" "}
                  {formatPrice(calculateDiscountedPrice(quantity))}
                </p>
              </div>
            )}
          </div>
          <div className="flex item-center justify-center text-primary-black text-xl font-bold">
            <a href="tel:0972819379">Hotline: 0972819379</a>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>
        <ul className="space-y-2">
          {product.reviews?.map((review) => (
            <li key={review.id} className="border-b border-gray-200 pb-2">
              <p className="font-semibold">{review.customerName}</p>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(parseFloat(review.rating.toString()))}{" "}
                <span className="text-gray-600">({review.rating})</span>
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
        <Image
          src={imageUrl}
          width={800}
          height={800}
          alt="Zoomed Product Image"
          className="max-w-full max-h-screen object-contain"
        />
      </div>
    </div>
  );
};
