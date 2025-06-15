"use client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';

const CheckoutSuccessContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const customerEmail = searchParams.get('email');

    // Redirect to home if no order data
    useEffect(() => {
        if (!orderId) {
            router.replace('/');
        }
    }, [orderId, router]);

    if (!orderId) {
        return null; // Will redirect
    }

    return (
        <>
            <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
            <div className="min-h-screen bg-gray-50 py-8 pt-28">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Đặt hàng thành công! 🎉
                        </h1>

                        <p className="text-lg text-gray-600 mb-6">
                            Cảm ơn bạn đã đặt hàng tại HA Food. Chúng tôi đã nhận được đơn hàng của bạn.
                        </p>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
                            <div className="space-y-2 text-left max-w-md mx-auto">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-semibold text-gray-900">#{orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-semibold text-gray-900">{customerEmail}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Chờ xử lý
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Bước tiếp theo</h3>
                            <div className="text-left space-y-2 text-blue-800">
                                <p className="flex items-start">
                                    <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">1</span>
                                    Chúng tôi sẽ xem xét và xác nhận đơn hàng của bạn
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">2</span>
                                    Nhân viên sẽ liên hệ với bạn để xác nhận thông tin giao hàng
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold text-center mr-3 mt-0.5">3</span>
                                    Đơn hàng sẽ được chuẩn bị và giao đến địa chỉ của bạn
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cần hỗ trợ?</h3>
                            <p className="text-gray-600 mb-4">
                                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>📞 Hotline: 0972819379</p>
                                <p>📧 Email: info@hafood.vn</p>
                                <p>🕒 Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Thứ 7)</p>
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
                            <p className="text-sm text-gray-500">
                                Bạn sẽ được nhân viên tư vấn gọi xác nhận đơn hàng trong thời gian sớm nhất.
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
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 py-8 pt-28 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
};

export default CheckoutSuccessPage;
