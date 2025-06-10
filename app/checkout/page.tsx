"use client";
import { useCart } from '@/hooks/CartContext';
import { District, Province, Ward } from '@/types/address';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';



const CheckoutPage = () => {
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: ''
    });

    // Address selection states
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [detailAddress, setDetailAddress] = useState('');

    // Fetch provinces on mount
    useEffect(() => {
        fetch('/api/address?type=provinces')
            .then(res => res.json())
            .then(data => setProvinces(data));
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (selectedProvince) {
            fetch(`/api/address?type=districts&code=${selectedProvince}`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []));
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedProvince]);

    // Fetch wards when district changes
    useEffect(() => {
        if (selectedDistrict) {
            fetch(`/api/address?type=wards&code=${selectedDistrict}`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []));
            setSelectedWard('');
        }
    }, [selectedDistrict]);

    // Update formData.customerAddress when address fields change
    useEffect(() => {
        const provinceObj = provinces.find(p => p.code === Number(selectedProvince));
        const districtObj = districts.find(d => d.code === Number(selectedDistrict));
        const wardObj = wards.find(w => w.code === Number(selectedWard));
        const address = [
            detailAddress,
            wardObj?.name,
            districtObj?.name,
            provinceObj?.name
        ].filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, customerAddress: address }));
    }, [detailAddress, selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.items.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.customerEmail)) {
            alert('Vui lòng nhập địa chỉ email hợp lệ!');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderItems = cart.items.map(item => ({
                productSku: item.productSKU,
                quantity: item.quantity,
                productPrice: item.currentPrice
            }));

            const orderData = {
                ...formData,
                orderItems
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (result.success) {
                // Clear cart after successful order
                clearCart();

                // Navigate to success page with order info
                router.push(`/checkout/success?orderId=${result.data.id}&email=${encodeURIComponent(formData.customerEmail)}`);
            } else {
                alert(result.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
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
                                onClick={() => router.push('/products')}
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
                            onClick={() => router.push('/cart')}
                            className="flex items-center text-primary hover:text-dark-red font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay lại giỏ hàng
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin đặt hàng</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ giao hàng
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                        <select
                                            value={selectedProvince}
                                            onChange={e => setSelectedProvince(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                            {provinces.map((p) => (
                                                <option key={p.code} value={p.code}>{p.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedDistrict}
                                            onChange={e => setSelectedDistrict(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Chọn Quận/Huyện</option>
                                            {districts.map((d) => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                        <select
                                            value={selectedWard}
                                            onChange={e => setSelectedWard(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map((w) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={detailAddress}
                                            onChange={e => setDetailAddress(e.target.value)}
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
                                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-4 mb-6">
                                {cart.items.map((item) => (
                                    <div key={item.productSKU} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                                        {item.imageUrl && (
                                            <Image
                                                src={(item.imageUrl)}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                width={64}
                                                height={64}
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.productName}</h3>
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
                                    <span className="text-lg font-medium text-gray-900">Tổng số lượng:</span>
                                    <span className="text-lg font-semibold text-gray-900">{cart.totalItems} sản phẩm</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
                                    <span className="text-xl font-bold text-primary">{formatPrice(cart.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
