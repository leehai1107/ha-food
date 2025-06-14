// Re-export types from the main types file for backward compatibility
export type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ProductResponse,
  ProductImage,
  CreateProductImageRequest,
  UpdateProductImageRequest,
  BulkCreateProductImagesRequest
} from './index';

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

export interface Product {
  id: string;
  productSku: string;
  productName: string;
  slug: string;
  productType: string;
  productDescriptions?: string;
  productContent?: string;
  productIngredients: string[];
  productPreserve?: string;
  currentPrice: string;
  originalPrice: string;
  quantity: number;
  available: boolean;
  rating?: string | number;
  reviewCount?: number;
  tags: string[];
  images: Array<{
    imageUrl: string;
    position: number;
  }>;
  category?: {
    id: string;
    name: string;
  };
  reviews?: Review[];
  discounts?: Discount[];
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: number;
  minQuantity: number;
  discountPercent: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDiscountRequest {
  minQuantity: number;
  discountPercent: number;
  isActive?: boolean;
}

export interface UpdateDiscountRequest {
  minQuantity?: number;
  discountPercent?: number;
  isActive?: boolean;
} 