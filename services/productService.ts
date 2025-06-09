import type { Product } from '../types';
import api from './api';

// Local API Response type to avoid import issues
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  productType?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductRequest {
  productSKU: string;
  productName: string;
  slug: string;
  quantity: number;
  productType: string;
  originalPrice: number;
  currentPrice: number;
  tags: string[];
  productDescriptions: string;
  productIngredients: string[];
  productContent: string;
  productPreserve: string;
  imageUrl?: string;
  images?: string[];
  available?: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: string;
}

export interface UpdateProductRequest {
  productSKU?: string;
  productName?: string;
  quantity?: number;
  productType?: string;
  originalPrice?: number;
  currentPrice?: number;
  tags?: string[];
  productDescriptions?: string;
  productIngredients?: string[];
  productContent?: string;
  productPreserve?: string;
  imageUrl?: string;
  images?: string[];
  available?: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: string;
}

export interface Review {
  id: number;
  productSku: string;
  customerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productSku: string;
  customerName: string;
  rating: number;
  content: string;
}

export interface UpdateReviewRequest {
  customerName?: string;
  rating?: number;
  content?: string;
}

class ProductService {
  // Get all products with filtering and pagination
  async getProducts(params?: ProductQueryParams): Promise<ApiResponse<ProductResponse>> {
    const queryString = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryString.append(key, value.join(','));
          } else {
            queryString.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get(`/api/products?${queryString.toString()}`);
    return response.data;
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/api/products/by-slug/${slug}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching product by slug:', error);
      return {
        success: false,
        data: null as any,
        message: error.message || 'Failed to fetch product'
      };
    }
  }

  // Legacy method for backward compatibility - now uses slug
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.getProductBySlug(id);
  }

  // Create new product
  async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    const response = await api.post('/api/products', productData);
    return response.data;
  }

  // Update product by SKU
  async updateProduct(sku: string, productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    const response = await api.put(`/api/products/${sku}`, productData);
    return response.data;
  }

  // Delete product by SKU
  async deleteProduct(sku: string): Promise<ApiResponse<Product>> {
    const response = await api.delete(`/api/products/${sku}`);
    return response.data;
  }

  // Get all product types
  async getProductTypes(): Promise<ApiResponse<string[]>> {
    const response = await api.get('/api/products/types/list');
    return response.data;
  }

  // Get all product tags
  async getProductTags(): Promise<ApiResponse<string[]>> {
    const response = await api.get('/api/products/tags/list');
    return response.data;
  }

  // Search products
  async searchProducts(searchTerm: string, filters?: Omit<ProductQueryParams, 'search'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...filters,
      search: searchTerm
    });
  }

  // Get products by type
  async getProductsByType(productType: string, params?: Omit<ProductQueryParams, 'productType'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...params,
      productType
    });
  }

  // Get available products only
  async getAvailableProducts(params?: Omit<ProductQueryParams, 'available'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...params,
      available: true
    });
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice: number, maxPrice: number, params?: Omit<ProductQueryParams, 'minPrice' | 'maxPrice'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...params,
      minPrice,
      maxPrice
    });
  }

  // Get products by tags
  async getProductsByTags(tags: string[], params?: Omit<ProductQueryParams, 'tags'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...params,
      tags
    });
  }

  // Get featured products (high rating)
  async getFeaturedProducts(limit: number = 10): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      sortBy: 'rating',
      sortOrder: 'desc',
      limit,
      available: true
    });
  }

  // Get newest products
  async getNewestProducts(limit: number = 10): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit,
      available: true
    });
  }

  // Get products sorted by price
  async getProductsSortedByPrice(order: 'asc' | 'desc' = 'asc', params?: Omit<ProductQueryParams, 'sortBy' | 'sortOrder'>): Promise<ApiResponse<ProductResponse>> {
    return this.getProducts({
      ...params,
      sortBy: 'price',
      sortOrder: order
    });
  }

  // Get product by SKU (now the primary identifier)
  async getProductBySku(sku: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/products/${sku}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching product by SKU:', error);
      return {
        success: false,
        data: null as any,
        message: error.message || 'Failed to fetch product'
      };
    }
  }

  async createReview(productSku: string, reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
    const response = await api.post(`/api/products/${productSku}/reviews`, reviewData);
    return response.data;
  }

  async updateReview(productSku: string, reviewId: number, reviewData: UpdateReviewRequest): Promise<ApiResponse<Review>> {
    const response = await api.put(`/api/products/${productSku}/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  async deleteReview(productSku: string, reviewId: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/products/${productSku}/reviews/${reviewId}`);
    return response.data;
  }

  async getProductReviews(productSku: string): Promise<ApiResponse<Review[]>> {
    const response = await api.get(`/api/products/${productSku}/reviews`);
    return response.data;
  }
}

// Export singleton instance
const productService = new ProductService();
export default productService;

// Export individual methods for convenience
export const {
  getProducts,
  getProductById,
  getProductBySku,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTypes,
  getProductTags,
  searchProducts,
  getProductsByType,
  getAvailableProducts,
  getProductsByPriceRange,
  getProductsByTags,
  getFeaturedProducts,
  getNewestProducts,
  getProductsSortedByPrice,
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
} = productService;
