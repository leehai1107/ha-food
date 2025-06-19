// =============================================================================
// SHARED TYPES - Based on Prisma Schema
// =============================================================================

import { Review } from './product';

// Export GHN types
export * from './ghn';

// Base types
export type ID = number;
export type SKU = string;
export type Decimal = string; // Prisma Decimal is returned as string in JSON

// =============================================================================
// ROLE TYPES
// =============================================================================

export interface Role {
  id: ID;
  name: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name?: string;
}

// =============================================================================
// ACCOUNT TYPES
// =============================================================================

export interface Account {
  id: ID;
  name: string;
  email: string;
  passwordHash: string;
  phone: string | null;
  address: string | null;
  roleId: ID;
  createdAt: string;
  // Relations
  role?: Role;
  orders?: Order[];
}

export interface SafeAccount extends Omit<Account, 'passwordHash'> {
  // Account without sensitive data
}

export interface CreateAccountRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  roleId: ID;
}

export interface UpdateAccountRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  roleId?: ID;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface Category {
  id: ID;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: ID | null;
  createdAt: string;
  // Relations
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
  _count?: {
    children: number;
    products: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: ID;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  parentId?: ID;
}

export interface CategoryQueryParams {
  includeProducts?: boolean;
  flat?: boolean;
}

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export interface Product {
  productSku: SKU;
  productName: string;
  slug: string;
  quantity: number;
  productType: string;
  originalPrice: Decimal;
  currentPrice: Decimal;
  tags: string[];
  productDescriptions: string | null;
  productIngredients: string[];
  productContent: string | null;
  productPreserve: string | null;
  available: boolean;
  rating: Decimal | null;
  reviewCount: number | null;
  weight: string | null;
  categoryId: ID | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  category?: Category | null;
  images?: ProductImage[];
  orderItems?: OrderItem[];
  _count?: {
    orderItems: number;
  };
  reviews ?: Review[];
}

export interface CreateProductRequest {
  productSku: SKU;
  productName: string;
  slug: string;
  quantity?: number;
  productType: string;
  originalPrice: number;
  currentPrice: number;
  tags?: string[];
  productDescriptions?: string;
  productIngredients?: string[];
  productContent?: string;
  productPreserve?: string;
  available?: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: string;
  categoryId?: ID;
}

export interface UpdateProductRequest {
  productSku?: SKU;
  productName?: string;
  slug?: string;
  quantity?: number;
  productType?: string;
  originalPrice?: number;
  currentPrice?: number;
  tags?: string[];
  productDescriptions?: string;
  productIngredients?: string[];
  productContent?: string;
  productPreserve?: string;
  available?: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: string;
  categoryId?: ID;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  productType?: string;
  categoryId?: ID | string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  includeImages?: boolean;
  includeCategory?: boolean;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// PRODUCT IMAGE TYPES
// =============================================================================

export interface ProductImage {
  id: ID;
  productSku: SKU;
  imageUrl: string;
  isPrimary: boolean;
  position: number;
  createdAt: string;
  // Relations
  product?: Product;
}

export interface CreateProductImageRequest {
  productSku: SKU;
  imageUrl: string;
  isPrimary?: boolean;
  position?: number;
}

export interface UpdateProductImageRequest {
  imageUrl?: string;
  isPrimary?: boolean;
  position?: number;
}

export interface BulkCreateProductImagesRequest {
  productSku: SKU;
  images: Array<{
    imageUrl: string;
    isPrimary?: boolean;
    position?: number;
  }>;
}

// =============================================================================
// CUSTOMER TYPES
// =============================================================================

export interface Customer {
  id: ID;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface BulkCreateCustomersRequest {
  customers: CreateCustomerRequest[];
}

// =============================================================================
// ORDER TYPES
// =============================================================================

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: ID;
  accountId: ID | null;
  status: OrderStatus;
  totalPrice: Decimal | null;
  createdAt: string;
  // Relations
  account?: Account | null;
  orderItems?: OrderItem[];
  _count?: {
    orderItems: number;
  };
}

export interface CreateOrderRequest {
  accountId?: ID;
  status?: OrderStatus;
  totalPrice?: number;
  orderItems?: CreateOrderItemRequest[];
}

export interface UpdateOrderRequest {
  accountId?: ID;
  status?: OrderStatus;
  totalPrice?: number;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  accountId?: ID;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
  includeItems?: boolean;
  includeAccount?: boolean;
}

// =============================================================================
// ORDER ITEM TYPES
// =============================================================================

export interface OrderItem {
  id: ID;
  orderId: ID;
  productSku: SKU | null;
  productName: string;
  productType: string;
  productPrice: Decimal;
  quantity: number;
  totalPrice: Decimal;
  tags: string[];
  productDescriptions: string | null;
  productIngredients: string[];
  productContent: string | null;
  productPreserve: string | null;
  weight: string | null;
  // Relations
  order?: Order;
  product?: Product | null;
}

export interface CreateOrderItemRequest {
  orderId?: ID; // Optional if creating with order
  productSku?: SKU;
  productName: string;
  productType: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  tags?: string[];
  productDescriptions?: string;
  productIngredients?: string[];
  productContent?: string;
  productPreserve?: string;
  weight?: string;
}

export interface UpdateOrderItemRequest {
  productSku?: SKU;
  productName?: string;
  productType?: string;
  productPrice?: number;
  quantity?: number;
  totalPrice?: number;
  tags?: string[];
  productDescriptions?: string;
  productIngredients?: string[];
  productContent?: string;
  productPreserve?: string;
  weight?: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface BaseQueryParams extends PaginationParams, SortParams {
  search?: string;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// =============================================================================
// DISCOUNT TYPES
// =============================================================================

export interface Discount {
  id: ID;
  minQuantity: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  minQuantity: number;
  discountPercent: Decimal;
  isActive?: boolean;
}

export interface UpdateDiscountRequest {
  minQuantity?: number;
  discountPercent?: Decimal;
  isActive?: boolean;
}

// =============================================================================
// GALLERY TYPES
// =============================================================================

export interface Gallery {
  id: ID;
  name: string;
  description?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  images?: GalleryImage[];
  _count?: {
    images: number;
  };
}

export interface GalleryImage {
  id: ID;
  galleryId: ID;
  imageUrl: string;
  altText?: string;
  position: number;
  createdAt: string;
  // Relations
  gallery?: Gallery;
}

export interface CreateGalleryRequest {
  name: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateGalleryRequest {
  name?: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface CreateGalleryImageRequest {
  galleryId: ID;
  imageUrl: string;
  altText?: string;
  position?: number;
}

export interface UpdateGalleryImageRequest {
  imageUrl?: string;
  altText?: string;
  position?: number;
}

export interface BulkCreateGalleryImagesRequest {
  galleryId: ID;
  images: Array<{
    imageUrl: string;
    altText?: string;
    position?: number;
  }>;
}

// =============================================================================
// NEWS TYPES
// =============================================================================

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  authorId?: number;
  author?: {
    id: number;
    name: string;
  };
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: 'published' | 'draft' | 'all';
}

export interface NewsListResponse {
  news: News[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// HOMEPAGE MANAGEMENT TYPES
// =============================================================================

export interface SectionLayout {
  id: number;
  sectionType: string;
  sectionName: string;
  position: number;
  isActive: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLayoutRequest {
  layouts: SectionLayout[];
}

// =============================================================================
// CART TYPES
// =============================================================================

export interface CartItem {
  productSKU: string;
  productName: string;
  currentPrice: number;
  originalPrice: number;
  quantity: number;
  imageUrl?: string;
  available: boolean;
  maxQuantity: number; // Available stock
  weight?: string;
  productType: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
  discounts?: Discount[];
}

export interface AddToCartRequest {
  productSKU: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productSKU: string;
  quantity: number;
}

// =============================================================================
// SYSTEM CONFIG TYPES
// =============================================================================

export * from './systemConfig';

export interface Stat {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export type GalleryImageItem = {
  url: string;
  alt: string;
};

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  type: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}