import type { Category, ApiResponse } from "../types";
import api from "./api";

export interface CategoryQueryParams {
  includeProducts?: boolean;
  flat?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  priority?: number;
  visible?: boolean;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  priority?: number;
  visible?: boolean;
}

class CategoryService {
  // Get all categories (hierarchical by default, flat if specified)
  async getCategories(
    params?: CategoryQueryParams
  ): Promise<ApiResponse<Category[]>> {
    const queryString = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/categories?${queryString.toString()}`);
    return response.data;
  }

  // Get category by ID
  async getCategoryById(
    id: number,
    includeProducts?: boolean
  ): Promise<ApiResponse<Category>> {
    const queryString = includeProducts ? "?includeProducts=true" : "";
    const response = await api.get(`/api/categories/${id}${queryString}`);
    return response.data;
  }

  // Create new category
  async createCategory(
    categoryData: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    const response = await api.post("/api/categories", categoryData);
    return response.data;
  }

  // Update category
  async updateCategory(
    id: number,
    categoryData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    const response = await api.put(`/api/categories/${id}`, categoryData);
    return response.data;
  }

  // Delete category
  async deleteCategory(id: number): Promise<ApiResponse<Category>> {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  }

  // Get flat list of categories (convenience method)
  async getFlatCategories(
    includeProducts?: boolean
  ): Promise<ApiResponse<Category[]>> {
    const queryString = includeProducts ? "&includeProducts=true" : "";
    const response = await api.get(`/api/categories?flat=true${queryString}`);
    return response.data;
  }

  // Get root categories with children (convenience method)
  async getHierarchicalCategories(
    includeProducts?: boolean
  ): Promise<ApiResponse<Category[]>> {
    return this.getCategories({
      flat: false,
      includeProducts,
    });
  }
}

// Export singleton instance
const categoryService = new CategoryService();
export default categoryService;

// Export individual methods for convenience
export const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFlatCategories,
  getHierarchicalCategories,
} = categoryService;
