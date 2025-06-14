import { useState } from 'react';
import AdminHeader from "@/components/common/admin-header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { account, logout } = useAuth();

    const tabs = [
        { id: 'dashboard', name: 'Tổng quan', icon: '📊', description: 'Thống kê tổng quan', path: '/admin' },
        { id: 'products', name: 'Sản phẩm', icon: '🗃️', description: 'Quản lý sản phẩm', path: '/admin/products' },
        { id: 'accounts', name: 'Tài khoản', icon: '👥', description: 'Quản lý người dùng', path: '/admin/accounts' },
        { id: 'orders', name: 'Đơn hàng', icon: '📦', description: 'Quản lý đơn hàng', path: '/admin/orders' },
        { id: 'categories', name: 'Danh mục', icon: '📂', description: 'Quản lý danh mục', path: '/admin/categories' },
        { id: 'news', name: 'Tin tức', icon: '📰', description: 'Quản lý tin tức', path: '/admin/news' },
        {id: 'discounts', name: 'Chiết khấu', icon: '💲', description: 'Quản lý chiết khấu', path: '/admin/discounts' },
        { id: 'system-config', name: 'Cấu hình', icon: '⚙️', description: 'Cấu hình hệ thống', path: '/admin/system-config' },
    ];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getCurrentTab = () => {
        // Handle exact match first
        const exactMatch = tabs.find(tab => tab.path === pathname);
        if (exactMatch) return exactMatch;

        // Handle index route (/admin)
        if (pathname === '/admin') {
            return tabs[0]; // Dashboard
        }

        // Fallback to dashboard
        return tabs[0];
    };

    const currentTab = getCurrentTab();

    return (
        <>
            <div className='flex min-h-screen bg-gray-50'>
                <AdminHeader
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    currentTab={currentTab}
                    tabs={tabs}
                    account={account}
                    onLogout={handleLogout}
                />
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                {/* Breadcrumb */}
                                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="hover:text-gray-700 transition-colors"
                                    >
                                        Admin
                                    </button>
                                    {pathname !== '/admin' && (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="text-gray-900 font-medium">{currentTab.name}</span>
                                        </>
                                    )}
                                </nav>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    {currentTab.name}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {currentTab.description}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex items-center space-x-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Về trang chủ</span>
                                </button>
                                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Hệ thống hoạt động</span>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
