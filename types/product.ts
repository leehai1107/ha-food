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
  createdAt: string;
  updatedAt: string;
} 