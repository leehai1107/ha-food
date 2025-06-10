"use client";
import orderService from '@/services/orderService';
import React, { useState, useEffect } from 'react';

interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    productPrice: number;
    totalPrice: number;
}

interface Order {
    id: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    account?: {
        id: number;
        name: string;
        email: string;
    } | null;
    orderItems: OrderItem[];
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-orange-100 text-orange-800';
            case 'ready':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'preparing':
                return 'Đang chuẩn bị';
            case 'ready':
                return 'Sẵn sàng';
            case 'delivered':
                return 'Đã giao';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getNextStatus = (currentStatus: string): string[] => {
        switch (currentStatus) {
            case 'pending':
                return ['confirmed', 'cancelled'];
            case 'confirmed':
                return ['preparing', 'cancelled'];
            case 'preparing':
                return ['ready', 'cancelled'];
            case 'ready':
                return ['delivered', 'cancelled'];
            case 'delivered':
                return [];
            case 'cancelled':
                return [];
            default:
                return [];
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const result = await orderService.getOrders();
            if (result.success) {
                if (Array.isArray(result.data)) {
                    setOrders(result.data);
                } else {
                    console.error('Expected orders to be an array but got:', result.data);
                    setOrders([]);
                }
            } else {
                console.error('Failed to fetch orders:', result);
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const result = await orderService.updateOrderStatus(orderId, { status: newStatus });
            if (result.success) {
                await fetchOrders();
                setShowStatusModal(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h2>
                <p className="text-gray-600">Theo dõi và xử lý đơn hàng</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="font-medium">Chưa có đơn hàng nào</p>
                    <p className="text-sm">Các đơn hàng sẽ hiển thị ở đây khi có khách hàng đặt hàng.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                            <div className="text-sm text-gray-500">{order.orderItems.length} sản phẩm</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.customerName || order.account?.name || 'Khách vãng lai'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.customerEmail || order.account?.email || 'Không có email'}
                                            </div>
                                            {order.customerPhone && (
                                                <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatPrice(order.totalPrice)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                {getNextStatus(order.status).length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowStatusModal(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Thay đổi trạng thái
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Chi tiết đơn hàng #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Information */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm">
                                            <span className="font-medium">Tên:</span>{' '}
                                            {selectedOrder.customerName || selectedOrder.account?.name || 'Khách vãng lai'}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span>{' '}
                                            {selectedOrder.customerEmail || selectedOrder.account?.email || 'Không có email'}
                                        </p>
                                        {selectedOrder.customerPhone && (
                                            <p className="text-sm">
                                                <span className="font-medium">Số điện thoại:</span> {selectedOrder.customerPhone}
                                            </p>
                                        )}
                                        {selectedOrder.customerAddress && (
                                            <p className="text-sm">
                                                <span className="font-medium">Địa chỉ:</span> {selectedOrder.customerAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sản phẩm</h4>
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sản phẩm</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Số lượng</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Đơn giá</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedOrder.orderItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(item.productPrice)}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900">{formatPrice(item.totalPrice)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                                                        Tổng cộng:
                                                    </td>
                                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                        {formatPrice(selectedOrder.totalPrice)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Trạng thái đơn hàng</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm">
                                            <span className="font-medium">Trạng thái hiện tại:</span>{' '}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                {getStatusText(selectedOrder.status)}
                                            </span>
                                        </p>
                                        <p className="text-sm mt-2">
                                            <span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Modal */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Thay đổi trạng thái đơn hàng #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Trạng thái hiện tại: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn trạng thái mới
                                    </label>
                                    <div className="space-y-2">
                                        {getNextStatus(selectedOrder.status).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(selectedOrder.id, status)}
                                                className="w-full px-4 py-2 text-sm font-medium text-left rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                {getStatusText(status)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
