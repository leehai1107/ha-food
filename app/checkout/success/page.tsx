"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense, useState } from "react";
import Image from "next/image";
import orderService, { type Order } from "@/services/orderService";

const CheckoutSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const customerEmail = searchParams.get("email");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        router.replace("/");
        return;
      }

      try {
        setLoading(true);
        const response = await orderService.getOrderById(parseInt(orderId));
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.message || "Không thể tải thông tin đơn hàng");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  // Redirect to home if no order data
  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!orderId) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-8 w-8 text-red-600"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không thể tải thông tin đơn hàng
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "Có lỗi xảy ra khi tải thông tin đơn hàng"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div
            className="rounded-lg shadow-sm p-8 text-center"
            style={{
              backgroundImage: 
                'url("/uploads/shared/images/banners/footer-bg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-secondary mb-4">
              Đặt hàng thành công! 🎉
            </h1>

            <p className="text-lg text-secondary mb-6">
              Cảm ơn bạn đã đặt hàng tại Ha Food. Chúng tôi đã nhận được đơn
              hàng của bạn.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900">
                    #{order.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">
                    {order.customerEmail || customerEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-semibold text-gray-900">
                    {order.customerPhone || " "}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                Sản phẩm đã đặt
              </h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.productPrice)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {(order.customerName ||
              order.customerPhone ||
              order.customerAddress) && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Thông tin khách hàng
                </h3>
                <div className="text-left space-y-2 text-blue-800">
                  {order.customerName && (
                    <p>
                      <strong>Tên:</strong> {order.customerName}
                    </p>
                  )}
                  {order.customerEmail && (
                    <p>
                      <strong>Email:</strong> {order.customerEmail}
                    </p>
                  )}
                  {order.customerPhone && (
                    <p>
                      <strong>Số điện thoại:</strong> {order.customerPhone}
                    </p>
                  )}
                  {order.customerAddress && (
                    <p>
                      <strong>Địa chỉ:</strong> {order.customerAddress}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Bước tiếp theo
              </h3>
              <div className="text-left space-y-2 text-blue-800">
                <p className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">
                    1
                  </span>
                  Chúng tôi sẽ xem xét và xác nhận đơn hàng của bạn
                </p>
                <p className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">
                    2
                  </span>
                  Nhân viên sẽ liên hệ với bạn để xác nhận thông tin giao hàng
                </p>
                <p className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">
                    3
                  </span>
                  Đơn hàng sẽ được chuẩn bị và giao đến địa chỉ của bạn
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Cần hỗ trợ?
              </h3>
              <p className="text-gray-600 mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với
                chúng tôi:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 Hotline: 0972819379</p>
                <p>📧 Email: info@hafood.vn</p>
                <p>🕒 Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Chủ Nhật)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-secondary">
                Bạn sẽ được nhân viên tư vấn gọi xác nhận đơn hàng trong thời
                gian sớm nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CheckoutSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8 pt-28 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;
