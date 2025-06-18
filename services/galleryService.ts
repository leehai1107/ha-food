const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Gallery API functions
export const galleryService = {
  // Get all galleries
  getAll: async (params?: any): Promise<ApiResponse> => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${API_BASE_URL}/api/galleries?${queryParams}` : `${API_BASE_URL}/api/galleries`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch galleries');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching galleries:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch galleries'
      };
    }
  },

  // Get gallery by ID
  getById: async (id: number, includeImages?: boolean): Promise<ApiResponse> => {
    try {
      const params = includeImages ? '?includeImages=true' : '';
      const response = await fetch(`${API_BASE_URL}/api/galleries/${id}${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch gallery');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching gallery:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch gallery'
      };
    }
  },

  // Create gallery
  create: async (galleryData: any): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(galleryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create gallery');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating gallery:', error);
      return {
        success: false,
        error: error.message || 'Failed to create gallery'
      };
    }
  },

  // Update gallery
  update: async (id: number, galleryData: any): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(galleryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update gallery');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating gallery:', error);
      return {
        success: false,
        error: error.message || 'Failed to update gallery'
      };
    }
  },

  // Delete gallery
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries/${id}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete gallery');
      }

      return result;
    } catch (error: any) {
      console.error('Error deleting gallery:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete gallery'
      };
    }
  },

  // Get gallery images
  getImages: async (galleryId: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}/images`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch gallery images');
      }

      return result;
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch gallery images'
      };
    }
  },

  // Add images to gallery
  addImages: async (galleryId: number, images: any[]): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}/images`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ images }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add images to gallery');
      }

      return result;
    } catch (error: any) {
      console.error('Error adding images to gallery:', error);
      return {
        success: false,
        error: error.message || 'Failed to add images to gallery'
      };
    }
  },

  // Update gallery image
  updateImage: async (galleryId: number, imageId: number, imageData: any): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}/images/${imageId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(imageData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update gallery image');
      }

      return result;
    } catch (error: any) {
      console.error('Error updating gallery image:', error);
      return {
        success: false,
        error: error.message || 'Failed to update gallery image'
      };
    }
  },

  // Delete gallery image
  deleteImage: async (galleryId: number, imageId: number): Promise<ApiResponse> => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}/images/${imageId}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete gallery image');
      }

      return result;
    } catch (error: any) {
      console.error('Error deleting gallery image:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete gallery image'
      };
    }
  }
};

export default galleryService; 