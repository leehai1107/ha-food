"use client";
import { useCart } from "@/hooks/CartContext";
import {
  GHNProvince,
  GHNDistrict,
  GHNWard,
  ShippingFeeResponse,
} from "@/types/ghn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  // Address selection states
  const [provinces, setProvinces] = useState<GHNProvince[]>([]);
  const [districts, setDistricts] = useState<GHNDistrict[]>([]);
  const [wards, setWards] = useState<GHNWard[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // Shipping fee states
  const [shippingFee, setShippingFee] = useState<ShippingFeeResponse | null>(
    null
  );
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Calculate total weight and dimensions from cart items
  const calculatePackageInfo = () => {
    let totalWeight = 0;
    let maxHeight = 0;
    let maxLength = 0;
    let maxWidth = 0;

    cart.items.forEach((item) => {
      // Convert weight from string to number (assuming weight is in grams)
      const itemWeight = item.weight ? parseInt(item.weight) || 500 : 500; // Default 500g if no weight
      totalWeight += itemWeight * item.quantity;

      // Estimate dimensions based on quantity (simple estimation)
      maxHeight = Math.max(maxHeight, 10); // 10cm height per item
      maxLength = Math.max(maxLength, 20); // 20cm length per item
      maxWidth = Math.max(maxWidth, 15); // 15cm width per item
    });

    return {
      weight: Math.max(totalWeight, 100), // Minimum 100g
      height: maxHeight,
      length: maxLength,
      width: maxWidth,
    };
  };

  // Calculate shipping fee
  const calculateShippingFee = async () => {
    if (!selectedDistrict || !selectedWard) {
      setShippingFee(null);
      setShippingError(null);
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const packageInfo = calculatePackageInfo();

      const requestBody = {
        service_id: 53320, // Standard delivery service
        to_district_id: parseInt(selectedDistrict),
        to_ward_code: selectedWard,
        height: packageInfo.height,
        length: packageInfo.length,
        weight: packageInfo.weight,
        width: packageInfo.width,
        insurance_value: cart.totalPrice,
      };

      const response = await fetch("/api/ghn?type=shipping-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.code === 200) {
        setShippingFee(result.data);
      } else {
        setShippingError(result.error || "Không thể tính phí vận chuyển");
        setShippingFee(null);
      }
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
      setShippingError("Lỗi khi tính phí vận chuyển");
      setShippingFee(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Calculate shipping fee when address changes
  useEffect(() => {
    if (selectedDistrict && selectedWard) {
      calculateShippingFee();
    }
  }, [selectedDistrict, selectedWard, cart.items]);

  // Fetch provinces on mount
  useEffect(() => {
    fetch("/api/ghn?type=provinces")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setProvinces(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`/api/ghn?type=districts&province_id=${selectedProvince}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            setDistricts(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/ghn?type=wards&district_id=${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            setWards(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  // Update formData.customerAddress when address fields change
  useEffect(() => {
    const provinceObj = provinces.find(
      (p) => p.ProvinceID.toString() === selectedProvince
    );
    const districtObj = districts.find(
      (d) => d.DistrictID.toString() === selectedDistrict
    );
    const wardObj = wards.find((w) => w.WardCode === selectedWard);
    const address = [
      detailAddress,
      wardObj?.WardName,
      districtObj?.DistrictName,
      provinceObj?.ProvinceName,
    ]
      .filter(Boolean)
      .join(", ");
    setFormData((prev) => ({ ...prev, customerAddress: address }));
  }, [
    detailAddress,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.items.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Validate shipping address
    if (
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !detailAddress.trim()
    ) {
      alert("Vui lòng chọn đầy đủ địa chỉ giao hàng!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      alert("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.items.map((item) => ({
        productSku: item.productSKU,
        quantity: item.quantity,
        productPrice: item.currentPrice,
      }));

      const orderData = {
        ...formData,
        orderItems,
        shippingFee: shippingFee?.total || 0,
        totalAmount: cart.totalPrice + (shippingFee?.total || 0),
        shippingAddress: {
          province: provinces.find(
            (p) => p.ProvinceID.toString() === selectedProvince
          )?.ProvinceName,
          district: districts.find(
            (d) => d.DistrictID.toString() === selectedDistrict
          )?.DistrictName,
          ward: wards.find((w) => w.WardCode === selectedWard)?.WardName,
          detailAddress: detailAddress,
          fullAddress: formData.customerAddress,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful order
        clearCart();

        // Navigate to success page with order info
        router.push(
          `/checkout/success?orderId=${
            result.data.id
          }&email=${encodeURIComponent(formData.customerEmail)}`
        );
      } else {
        alert(
          result.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!"
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🛒</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-600 mb-6">
                Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục thanh toán
              </p>
              <button
                onClick={() => router.push("/products")}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Khám phá sản phẩm
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/cart")}
              className="flex items-center text-primary hover:text-dark-red font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Quay lại giỏ hàng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin đặt hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Địa chỉ giao hàng
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map((p) => (
                        <option
                          key={p.ProvinceID}
                          value={p.ProvinceID.toString()}
                        >
                          {p.ProvinceName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={!selectedProvince}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map((d) => (
                        <option
                          key={d.DistrictID}
                          value={d.DistrictID.toString()}
                        >
                          {d.DistrictName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={!selectedDistrict}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((w) => (
                        <option key={w.WardCode} value={w.WardCode}>
                          {w.WardName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={detailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Số nhà, tên đường..."
                      disabled={!selectedWard}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.productSKU}
                    className="flex items-center space-x-4 py-4 border-b border-gray-200"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                        width={64}
                        height={64}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.currentPrice)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.currentPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-900">
                    Tổng số lượng:
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {cart.totalItems} sản phẩm
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-medium text-gray-700">
                    Tạm tính:
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-gray-700">
                    {cart.totalPrice >= 400000
                      ? "Hỗ trợ vận chuyển:"
                      : "Phí vận chuyển:"}
                  </span>
                  <div className="text-right">
                    {isCalculatingShipping ? (
                      <span className="text-sm text-gray-500">
                        Đang tính...
                      </span>
                    ) : shippingError ? (
                      <span className="text-sm text-red-500">
                        {shippingError}
                      </span>
                    ) : shippingFee ? (
                      cart.totalPrice >= 400000 ? (
                        <span className="text-base font-semibold text-green-600">
                          -30 000 đ
                        </span>
                      ) : (
                        <span className="text-base font-semibold text-gray-900">
                          {formatPrice(shippingFee.total)}
                        </span>
                      )
                    ) : selectedDistrict && selectedWard ? (
                      <span className="text-sm text-gray-500">
                        Chưa tính được
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Chọn địa chỉ để tính phí
                      </span>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(
                      cart.totalPrice +
                        (shippingFee?.service_fee || 0) -
                        (cart.totalPrice >= 400000 ? 30000 : 0)
                    )}
                  </span>
                </div>

                {/* Shipping Info */}
                {shippingFee && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Thông tin vận chuyển:</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Phí dịch vụ: {formatPrice(shippingFee.service_fee)}| Dự
                      kiến giao hàng trong 2-3 ngày
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
