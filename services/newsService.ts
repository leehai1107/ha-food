import type {
  News,
  CreateNewsRequest,
  UpdateNewsRequest,
  NewsQueryParams,
  NewsListResponse,
  ApiResponse
} from '../types';
import api from './api';

class NewsService {
  // Public endpoints (no auth required)

  async getPublishedNews(params?: NewsQueryParams): Promise<ApiResponse<NewsListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tag) queryParams.append('tag', params.tag);

    const response = await api.get(`/api/news?${queryParams.toString()}`);
    return response.data;
  }

  async getNewsBySlug(slug: string): Promise<ApiResponse<News>> {
    const response = await api.get(`/api/news/${slug}`);
    return response.data;
  }

  async getAllTags(): Promise<ApiResponse<string[]>> {
    const response = await api.get('/api/news/tags/all');
    return response.data;
  }

  // Admin endpoints (auth required)

  async getAllNews(params?: NewsQueryParams): Promise<ApiResponse<NewsListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const response = await api.get(`/api/news/admin?${queryParams.toString()}`);
    return response.data;
  }

  async getNewsById(id: number): Promise<ApiResponse<News>> {
    const response = await api.get(`/api/news/admin/${id}`);
    return response.data;
  }

  async createNews(data: CreateNewsRequest): Promise<ApiResponse<News>> {
    const response = await api.post('/api/news', data);
    return response.data;
  }

  async updateNews(id: number, data: UpdateNewsRequest): Promise<ApiResponse<News>> {
    const response = await api.put(`/api/news/${id}`, data);
    return response.data;
  }

  async deleteNews(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/news/${id}`);
    return response.data;
  }

  // Image upload methods

  async createNewsWithImage(data: CreateNewsRequest, imageFile: File): Promise<ApiResponse<News>> {
    const formData = new FormData();

    // Add all form fields
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt || '');
    formData.append('content', data.content);
    formData.append('tags', JSON.stringify(data.tags || []));
    formData.append('isPublished', (data.isPublished ?? false).toString());
    if (data.publishedAt) {
      formData.append('publishedAt', data.publishedAt);
    }

    // Add image file
    formData.append('image', imageFile);

    const response = await api.post('/api/news/with-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateNewsWithImage(id: number, data: UpdateNewsRequest, imageFile?: File): Promise<ApiResponse<News>> {
    const formData = new FormData();

    // Add all form fields - only append if they exist since UpdateNewsRequest fields are optional
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.excerpt !== undefined) {
      formData.append('excerpt', data.excerpt || '');
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    formData.append('tags', JSON.stringify(data.tags || []));
    if (data.isPublished !== undefined) {
      formData.append('isPublished', data.isPublished.toString());
    }
    if (data.publishedAt) {
      formData.append('publishedAt', data.publishedAt);
    }

    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.put(`/api/news/${id}/with-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Utility methods

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const words = this.stripHtml(content).split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

export default new NewsService();
