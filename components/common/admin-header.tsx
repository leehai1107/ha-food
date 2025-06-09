import React from 'react';
import { useRouter } from 'next/navigation';
import { Account } from '@/types';

interface AdminHeaderProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    currentTab: {
        id: string;
        name: string;
        icon: string;
        description: string;
        path: string;
    };
    tabs: Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
        path: string;
    }>;
    account: Account | null;
    onLogout: () => void;
}

/**
 * AdminLayout - Main layout component for admin pages
 *
 * Provides nested routing for admin sections:
 * - /admin (dashboard)
 * - /admin/products
 * - /admin/accounts
 * - /admin/orders
 * - /admin/categories
 * - /admin/homepage
 * - /admin/news
 * - /admin/system-config
 */

const AdminHeader: React.FC<AdminHeaderProps> = ({
    sidebarCollapsed,
    setSidebarCollapsed,
    currentTab,
    tabs,
    account,
    onLogout
}) => {
    const router = useRouter();

    return (
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">HA</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                                <p className="text-xs text-gray-500">HA Food Management</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => router.push(tab.path)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${currentTab.id === tab.id
                            ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        title={sidebarCollapsed ? tab.name : ''}
                    >
                        <span className="text-xl flex-shrink-0">{tab.icon}</span>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{tab.name}</div>
                                <div className="text-xs text-gray-500 truncate">{tab.description}</div>
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            {/* User Profile & Actions */}
            <div className="p-4 border-t border-gray-200">
                {!sidebarCollapsed && (
                    <div className="mb-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {account?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{account?.name}</div>
                                <div className="text-xs text-gray-500 truncate">{account?.role?.name}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Back to Homepage Button */}
                <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-2"
                    title={sidebarCollapsed ? 'Về trang chủ' : ''}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {!sidebarCollapsed && <span className="font-medium">Về trang chủ</span>}
                </button>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={sidebarCollapsed ? 'Đăng xuất' : ''}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                    </svg>
                    {!sidebarCollapsed && <span className="font-medium">Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminHeader;
