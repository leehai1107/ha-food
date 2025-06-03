import type {
  SystemConfig,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
  SystemConfigQueryParams,
  SystemTheme
} from '../types/systemConfig';
import api from './api';


interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

class SystemConfigService {
  // Get all system configurations
  async getConfigs(params?: SystemConfigQueryParams): Promise<ApiResponse<SystemConfig[]>> {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/api/system-config?${queryParams.toString()}`);
    return response.data;
  }

  // Get theme configuration as object
  async getTheme(): Promise<ApiResponse<SystemTheme>> {
    const response = await api.get('/api/system-config/theme');
    return response.data;
  }

  // Get single configuration by key
  async getConfigByKey(key: string): Promise<ApiResponse<SystemConfig>> {
    const response = await api.get(`/api/system-config/${key}`);
    return response.data;
  }

  // Create new configuration (admin only)
  async createConfig(data: CreateSystemConfigRequest): Promise<ApiResponse<SystemConfig>> {
    const response = await api.post('/api/system-config', data);
    return response.data;
  }

  // Update configuration (admin only)
  async updateConfig(key: string, data: UpdateSystemConfigRequest): Promise<ApiResponse<SystemConfig>> {
    const response = await api.put(`/api/system-config/${key}`, data);
    return response.data;
  }

  // Delete configuration (admin only)
  async deleteConfig(key: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/system-config/${key}`);
    return response.data;
  }

  // Upload logo image (admin only)
  async uploadLogo(file: File): Promise<ApiResponse<{ config: SystemConfig; imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/api/system-config/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload favicon image (admin only)
  async uploadFavicon(file: File): Promise<ApiResponse<{ config: SystemConfig; imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/api/system-config/upload-favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Bulk update configurations (admin only)
  async bulkUpdateConfigs(configs: { key: string; value: string }[]): Promise<ApiResponse<SystemConfig[]>> {
    try {
      const response = await api.post('/api/system-config/bulk-update', { configs });
      return response.data;
    } catch (error) {
      // Fallback to individual updates if bulk update is not available
      const promises = configs.map(config =>
        this.updateConfig(config.key, { value: config.value }).catch(async () => {
          // If update fails, try to create the config
          return this.createConfig({
            key: config.key,
            value: config.value,
            type: 'json',
            category: 'animation',
            label: config.key,
            description: `Animation configuration for ${config.key}`
          });
        })
      );

      const results = await Promise.all(promises);
      const updatedConfigs = results.map(result => result.data);

      return {
        success: true,
        data: updatedConfigs,
        message: 'Configurations updated successfully'
      };
    }
  }

  // Initialize default configurations
  async initializeDefaults(): Promise<ApiResponse<SystemConfig[]>> {
    const defaultConfigs = [
      // Theme Colors
      { key: 'primaryColor', value: '#8B4513', type: 'color', category: 'theme', label: 'Primary Color', description: 'Main brand color' },
      { key: 'secondaryColor', value: '#D4AF37', type: 'color', category: 'theme', label: 'Secondary Color', description: 'Secondary brand color' },
      { key: 'accentColor', value: '#F4A460', type: 'color', category: 'theme', label: 'Accent Color', description: 'Accent color for highlights' },
      { key: 'backgroundColor', value: '#FFFFFF', type: 'color', category: 'theme', label: 'Background Color', description: 'Main background color' },
      { key: 'textColor', value: '#1F2937', type: 'color', category: 'theme', label: 'Text Color', description: 'Primary text color' },
      { key: 'linkColor', value: '#3B82F6', type: 'color', category: 'theme', label: 'Link Color', description: 'Color for links' },
      { key: 'borderColor', value: '#E5E7EB', type: 'color', category: 'theme', label: 'Border Color', description: 'Color for borders' },

      // Typography
      { key: 'primaryFont', value: 'Inter, system-ui, sans-serif', type: 'font', category: 'typography', label: 'Primary Font', description: 'Main font family' },
      { key: 'secondaryFont', value: 'Inter, system-ui, sans-serif', type: 'font', category: 'typography', label: 'Secondary Font', description: 'Secondary font family' },
      { key: 'headingFont', value: 'Inter, system-ui, sans-serif', type: 'font', category: 'typography', label: 'Heading Font', description: 'Font for headings' },
      { key: 'fontSize', value: '16px', type: 'text', category: 'typography', label: 'Base Font Size', description: 'Base font size' },
      { key: 'lineHeight', value: '1.5', type: 'text', category: 'typography', label: 'Line Height', description: 'Base line height' },

      // Layout
      { key: 'containerMaxWidth', value: '1280px', type: 'text', category: 'layout', label: 'Container Max Width', description: 'Maximum container width' },
      { key: 'borderRadius', value: '8px', type: 'text', category: 'layout', label: 'Border Radius', description: 'Default border radius' },
      { key: 'spacing', value: '1rem', type: 'text', category: 'layout', label: 'Base Spacing', description: 'Base spacing unit' },
      { key: 'headerHeight', value: '80px', type: 'text', category: 'layout', label: 'Header Height', description: 'Height of the header' },

      // General/Branding
      { key: 'siteName', value: 'HA Food', type: 'text', category: 'general', label: 'Site Name', description: 'Website name' },
      { key: 'siteDescription', value: 'Tinh hoa ẩm thực Việt Nam', type: 'text', category: 'general', label: 'Site Description', description: 'Website description' },
      { key: 'logoUrl', value: '/logo.png', type: 'text', category: 'general', label: 'Logo URL', description: 'Logo image URL' },
      { key: 'faviconUrl', value: '/favicon.ico', type: 'text', category: 'general', label: 'Favicon URL', description: 'Favicon URL' },

      // Email Configuration
      { key: 'smtpHost', value: '', type: 'text', category: 'email', label: 'SMTP Host', description: 'SMTP server hostname' },
      { key: 'smtpPort', value: '587', type: 'text', category: 'email', label: 'SMTP Port', description: 'SMTP server port' },
      { key: 'smtpUser', value: '', type: 'text', category: 'email', label: 'SMTP Username', description: 'SMTP authentication username' },
      { key: 'smtpPassword', value: '', type: 'password', category: 'email', label: 'SMTP Password', description: 'SMTP authentication password' },
      { key: 'smtpSecure', value: 'false', type: 'boolean', category: 'email', label: 'SMTP Secure', description: 'Use SSL/TLS for SMTP connection' },
      { key: 'adminEmail', value: '', type: 'email', category: 'email', label: 'Admin Email', description: 'Email address to receive order notifications' }
    ];

    const promises = defaultConfigs.map(config =>
      this.createConfig(config as CreateSystemConfigRequest).catch(() => null)
    );

    const results = await Promise.all(promises);
    const createdConfigs = results.filter(result => result !== null).map(result => result!.data);

    return {
      success: true,
      data: createdConfigs,
      message: 'Default configurations initialized'
    };
  }

  // Apply theme to CSS variables
  applyTheme(theme: Partial<SystemTheme>): void {
    const root = document.documentElement;

    // Apply colors
    if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
    if (theme.secondaryColor) root.style.setProperty('--color-secondary', theme.secondaryColor);
    if (theme.accentColor) root.style.setProperty('--color-accent', theme.accentColor);
    if (theme.backgroundColor) root.style.setProperty('--color-background', theme.backgroundColor);
    if (theme.textColor) root.style.setProperty('--color-text', theme.textColor);
    if (theme.linkColor) root.style.setProperty('--color-link', theme.linkColor);
    if (theme.borderColor) root.style.setProperty('--color-border', theme.borderColor);

    // Apply typography
    if (theme.primaryFont) root.style.setProperty('--font-primary', theme.primaryFont);
    if (theme.secondaryFont) root.style.setProperty('--font-secondary', theme.secondaryFont);
    if (theme.headingFont) root.style.setProperty('--font-heading', theme.headingFont);
    if (theme.fontSize) root.style.setProperty('--font-size-base', theme.fontSize);
    if (theme.lineHeight) root.style.setProperty('--line-height-base', theme.lineHeight);

    // Apply layout
    if (theme.containerMaxWidth) root.style.setProperty('--container-max-width', theme.containerMaxWidth);
    if (theme.borderRadius) root.style.setProperty('--border-radius', theme.borderRadius);
    if (theme.spacing) root.style.setProperty('--spacing-base', theme.spacing);
    if (theme.headerHeight) root.style.setProperty('--header-height', theme.headerHeight);
  }

  // Get configuration value by key (with fallback)
  getConfigValue(configs: SystemConfig[], key: string, fallback: string = ''): string {
    const config = configs.find(c => c.key === key && c.isActive);
    return config?.value || fallback;
  }

  // Group configurations by category
  groupByCategory(configs: SystemConfig[]): Record<string, SystemConfig[]> {
    return configs.reduce((groups, config) => {
      const category = config.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(config);
      return groups;
    }, {} as Record<string, SystemConfig[]>);
  }
}

export default new SystemConfigService();
