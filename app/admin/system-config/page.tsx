"use client";
import systemConfigService from '@/services/systemConfigService';
import { SystemConfig } from '@/types';
import { useState, useEffect } from 'react';


const SystemConfigManagement = () => {
    const [configs, setConfigs] = useState<SystemConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const response = await systemConfigService.getConfigs();
            if (response.success) {
                setConfigs(response.data);
            }
        } catch (error) {
            console.error('Error fetching configs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfigChange = (key: string, value: string) => {
        setConfigs(prev => prev.map(config =>
            config.key === key ? { ...config, value } : config
        ));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const updates = configs.map(config => ({
                key: config.key,
                value: config.value
            }));

            await systemConfigService.bulkUpdateConfigs(updates);
            alert('Email configuration saved successfully!');
        } catch (error) {
            console.error('Error saving configs:', error);
            alert('Failed to save email configuration');
        } finally {
            setSaving(false);
        }
    };

    const getConfigsByCategory = (category: string): SystemConfig[] => {
        return configs.filter(c => c.category === category);
    };

    const renderTextInput = (config: SystemConfig) => (
        <div key={config.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {config.label}
            </label>
            <input
                type="text"
                value={config.value}
                onChange={(e) => handleConfigChange(config.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {config.description && (
                <p className="text-xs text-gray-500">{config.description}</p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Email Configuration</h2>
                    <p className="text-gray-600">Configure SMTP settings for email notifications</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Settings</h3>
                        <p className="text-gray-600 mb-6">
                            Configure SMTP settings to enable email notifications for new orders.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getConfigsByCategory('email').map(config => {
                                if (config.type === 'password') {
                                    return (
                                        <div key={config.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {config.label}
                                            </label>
                                            <input
                                                type="password"
                                                value={config.value}
                                                onChange={(e) => handleConfigChange(config.key, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={config.description}
                                            />
                                        </div>
                                    );
                                } else if (config.type === 'boolean') {
                                    return (
                                        <div key={config.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {config.label}
                                            </label>
                                            <select
                                                value={config.value}
                                                onChange={(e) => handleConfigChange(config.key, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                            <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                                        </div>
                                    );
                                } else if (config.type === 'email') {
                                    return (
                                        <div key={config.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {config.label}
                                            </label>
                                            <input
                                                type="email"
                                                value={config.value}
                                                onChange={(e) => handleConfigChange(config.key, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={config.description}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                                        </div>
                                    );
                                } else {
                                    return renderTextInput(config);
                                }
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">📧 Email Setup Instructions</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Configure SMTP settings to enable order notification emails</li>
                                <li>• Admin Email will receive notifications when new orders are placed</li>
                                <li>• Use port 587 for TLS or 465 for SSL connections</li>
                                <li>• Test your configuration by placing a test order</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemConfigManagement;
