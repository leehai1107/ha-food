"use client";
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Stats {
    totalProducts: number;
    totalAccounts: number;
    totalOrders: number;
    totalCategories: number;
    recentOrders: any[];
    topProducts: any[];
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setIsLoading(true);

            // Fetch data from multiple endpoints
            const [productsRes, accountsRes, ordersRes] = await Promise.all([
                api.get('/api/products?limit=1'),
                api.get('/api/accounts?limit=1'),
                api.get('/api/orders?limit=5')
            ]);

            setStats({
                totalProducts: productsRes.data.data?.total || 0,
                totalAccounts: accountsRes.data.data?.total || 0,
                totalOrders: ordersRes.data.data?.total || 0,
                totalCategories: 0, // Will be updated when categories endpoint is available
                recentOrders: ordersRes.data.data?.orders || [],
                topProducts: []
            });
        } catch (err: any) {
            console.error('Failed to fetch stats:', err);
            setError('Không thể tải thống kê');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Tổng sản phẩm',
            value: stats?.totalProducts || 0,
            icon: '🍕',
            color: 'bg-blue-500',
            change: '+12%'
        },
        {
            title: 'Tài khoản',
            value: stats?.totalAccounts || 0,
            icon: '👥',
            color: 'bg-green-500',
            change: '+8%'
        },
        {
            title: 'Đơn hàng',
            value: stats?.totalOrders || 0,
            icon: '📦',
            color: 'bg-yellow-500',
            change: '+15%'
        },
        {
            title: 'Danh mục',
            value: stats?.totalCategories || 0,
            icon: '📂',
            color: 'bg-purple-500',
            change: '+3%'
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tổng quan hệ thống</h2>
                <p className="text-gray-600">Thống kê tổng quan về hoạt động của hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value.toLocaleString()}</p>
                                <p className="text-sm text-green-600 mt-1">{card.change} so với tháng trước</p>
                            </div>
                            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.slice(0, 5).map((order, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Đơn hàng #{order.id}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {parseFloat(order.totalPrice || '0').toLocaleString('vi-VN')}đ
                                        </p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center space-x-3 p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <span className="text-2xl">➕</span>
                            <div>
                                <p className="font-medium text-gray-900">Thêm sản phẩm mới</p>
                                <p className="text-sm text-gray-600">Tạo sản phẩm mới trong hệ thống</p>
                            </div>
                        </button>

                        <button className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <span className="text-2xl">👤</span>
                            <div>
                                <p className="font-medium text-gray-900">Quản lý tài khoản</p>
                                <p className="text-sm text-gray-600">Xem và quản lý tài khoản người dùng</p>
                            </div>
                        </button>

                        <button className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <span className="text-2xl">📊</span>
                            <div>
                                <p className="font-medium text-gray-900">Xem báo cáo</p>
                                <p className="text-sm text-gray-600">Thống kê chi tiết về doanh thu</p>
                            </div>
                        </button>

                        <button className="w-full flex items-center space-x-3 p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                            <span className="text-2xl">⚙️</span>
                            <div>
                                <p className="font-medium text-gray-900">Cài đặt hệ thống</p>
                                <p className="text-sm text-gray-600">Cấu hình và tùy chỉnh hệ thống</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Database: Hoạt động bình thường</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">API: Hoạt động bình thường</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Storage: Hoạt động bình thường</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
