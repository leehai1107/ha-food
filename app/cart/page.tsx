"use client";
import { useCart } from "@/hooks/CartContext";
import { CartItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const CartPage = () => {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getDiscountedTotal,
    getItemDiscountedPrice,
    discounts,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (productSKU: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productSKU);
    } else {
      updateQuantity(productSKU, newQuantity);
    }
  };

  const handleRemoveItem = (productSKU: string) => {
    removeFromCart(productSKU);
  };

  const handleClearCart = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
      )
    ) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => {
    const itemTotal = item.currentPrice * item.quantity;
    const discountedPrice = getItemDiscountedPrice(item);
    const discountedTotal = discountedPrice * item.quantity;
    const hasDiscount = item.originalPrice > item.currentPrice;
    const hasBulkDiscount = discountedPrice < item.currentPrice;

    // Get applicable bulk discount
    const applicableDiscount = discounts
      .filter((d) => d.isActive && item.quantity >= d.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 sm:py-6 border-b border-gray-200">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-6">
          <Image
            src={item.imageUrl || "/image/noimage.png"}
            width={96}
            height={96}
            alt={item.productName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full">
          <div className="flex justify-between">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                <Link
                  href={`/product/${item.productSKU}`}
                  className="hover:text-primary transition-colors"
                >
                  {item.productName}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Loại: {item.productType}
                {item.weight && ` • Trọng lượng: ${item.weight}`}
              </p>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-base sm:text-lg font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
                {hasBulkDiscount && applicableDiscount && (
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    ({applicableDiscount.discountPercent}% chiết khấu)
                  </span>
                )}
              </div>

              {/* Availability */}
              {!item.available && (
                <p className="text-xs sm:text-sm text-primary font-medium">
                  ⚠️ Sản phẩm hiện không có sẵn
                </p>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemoveItem(item.productSKU)}
              className="text-gray-400 hover:text-primary transition-colors p-2 ml-2"
              title="Xóa sản phẩm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Quantity Controls and Total */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-gray-600">
                Số lượng:
              </span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productSKU, item.quantity - 1)
                  }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[2.5rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productSKU, item.quantity + 1)
                  }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={item.quantity >= item.maxQuantity}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">
                (Tối đa: {item.maxQuantity})
              </span>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {formatPrice(discountedTotal)}
              </p>
              {hasBulkDiscount && (
                <p className="text-xs sm:text-sm text-green-600">
                  Tiết kiệm: {formatPrice(itemTotal - discountedTotal)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm">
            <Link href="/" className="text-primary hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </nav>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-red-700 font-medium text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tiếp tục mua sắm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Giỏ hàng ({cart.totalItems} sản phẩm)
                  </h1>
                  {cart.items.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-xs sm:text-sm text-primary hover:text-red-700 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
              </div>

              <div className="px-4 sm:px-6">
                {cart.items.length === 0 ? (
                  <div className="py-8 sm:py-12 text-center">
                    <div className="text-5xl sm:text-6xl text-gray-300 mb-4">
                      🛒
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Giỏ hàng của bạn đang trống
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                      Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div>
                    {cart.items.map((item) => (
                      <CartItemComponent key={item.productSKU} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          {cart.items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 sm:top-8">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>

                  {getDiscountedTotal() < getCartTotal() && (
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>Chiết khấu:</span>
                      <span className="font-medium">
                        -{formatPrice(getCartTotal() - getDiscountedTotal())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">
                      {getDiscountedTotal() >= 400000
                        ? "Hỗ trợ vận chuyển:"
                        : "Phí vận chuyển:"}
                    </span>
                    <span className="font-medium text-primary">
                      {getDiscountedTotal() >= 400000
                        ? "-30 000 đ"
                        : "Chưa rõ"}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between">
                      <span className="text-base sm:text-lg font-semibold">
                        Tổng cộng:
                      </span>
                      <span className="text-base sm:text-lg font-bold text-primary">
                        {formatPrice(
                          getDiscountedTotal() -
                            (getDiscountedTotal() >= 400000 ? 30000 : 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
                  >
                    Tiến hành thanh toán
                  </button>

                  <Link
                    href="/products"
                    className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold mt-3 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
