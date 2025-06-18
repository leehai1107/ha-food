const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL|| 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Product API functions with image upload
export const productApi = {
  // Create product with images
  createWithImages: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/products/with-images`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating product with images:', error);
      return {
        success: false,
        error: error.message || 'Failed to create product'
      };
    }
  },

  // Update product with images
  updateWithImages: async (sku: string, formData: FormData): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/products/${sku}/with-images`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update product');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating product with images:', error);
      return {
        success: false,
        error: error.message || 'Failed to update product'
      };
    }
  },

  // Create product without images (existing endpoint)
  create: async (productData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.message || 'Failed to create product'
      };
    }
  },

  // Update product without images (existing endpoint)
  update: async (sku: string, productData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${sku}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update product');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: error.message || 'Failed to update product'
      };
    }
  },

  // Get all products
  getAll: async (params?: any): Promise<ApiResponse> => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${API_BASE_URL}/api/products?${queryParams}` : `${API_BASE_URL}/api/products`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch products');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch products'
      };
    }
  },

  // Get product by SKU
  getBySku: async (sku: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${sku}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch product');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch product'
      };
    }
  },

  // Delete product
  delete: async (sku: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${sku}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete product');
      }

      return result;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete product'
      };
    }
  }
};

// Category API functions with image upload
export const categoryApi = {
  // Create category with image
  createWithImage: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/with-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create category');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating category with image:', error);
      return {
        success: false,
        error: error.message || 'Failed to create category'
      };
    }
  },

  // Update category with image
  updateWithImage: async (id: number, formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}/with-image`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update category');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating category with image:', error);
      return {
        success: false,
        error: error.message || 'Failed to update category'
      };
    }
  },

  // Create category without image (existing endpoint)
  create: async (categoryData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create category');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.message || 'Failed to create category'
      };
    }
  },

  // Update category without image (existing endpoint)
  update: async (id: number, categoryData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update category');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error.message || 'Failed to update category'
      };
    }
  },

  // Get all categories
  getAll: async (params?: any): Promise<ApiResponse> => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${API_BASE_URL}/api/categories?${queryParams}` : `${API_BASE_URL}/api/categories`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch categories');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch categories'
      };
    }
  },

  // Get category by ID
  getById: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch category');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch category'
      };
    }
  },

  // Delete category
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete category');
      }

      return result;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete category'
      };
    }
  }
};

// General upload API functions
export const uploadApi = {
  // Upload single file
  uploadFile: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/upload/single`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload file');
      }

      return result;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      };
    }
  },

  // Upload multiple files
  uploadFiles: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/upload/multiple`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload files');
      }

      return result;
    } catch (error: any) {
      console.error('Error uploading files:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload files'
      };
    }
  },

  // Delete file
  deleteFile: async (uploadType: string, filename: string): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/upload/${uploadType}/${filename}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete file');
      }

      return result;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file'
      };
    }
  }
};
