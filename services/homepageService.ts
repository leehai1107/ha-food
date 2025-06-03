import type { ApiResponse } from '../types';
import api from './api';

export interface HomepageContent {
  id: number;
  section: string;
  title?: string;
  subtitle?: string;
  content?: any;
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

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FooterSection {
  id: number;
  section: string;
  title?: string;
  content?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageData {
  content: HomepageContent[];
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  clients: Client[];
  footerSections: FooterSection[];
  sectionLayouts: SectionLayout[];
}

export interface CreateHeroSlideRequest {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink?: string;
  imageUrl: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateHeroSlideRequest {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  position?: number;
  isActive?: boolean;
}

export interface CreateTestimonialRequest {
  name: string;
  location: string;
  type: string;
  content: string;
  avatarUrl?: string;
  rating?: number;
  position?: number;
  isActive?: boolean;
}

export interface UpdateTestimonialRequest {
  name?: string;
  location?: string;
  type?: string;
  content?: string;
  avatarUrl?: string;
  rating?: number;
  position?: number;
  isActive?: boolean;
}

export interface UpdateContentRequest {
  title?: string;
  subtitle?: string;
  content?: any;
  isActive?: boolean;
}

export interface CreateClientRequest {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateClientRequest {
  name?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateFooterSectionRequest {
  title?: string;
  content?: any;
  isActive?: boolean;
}

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
  layouts: {
    sectionType: string;
    position: number;
    isActive: boolean;
  }[];
}

class HomepageService {
  // Get all homepage content (public)
  async getHomepageContent(): Promise<ApiResponse<HomepageData>> {
    const response = await api.get('/api/homepage/content');
    return response.data;
  }

  // Get specific section content
  async getSectionContent(section: string): Promise<ApiResponse<HomepageContent>> {
    const response = await api.get(`/api/homepage/content/${section}`);
    return response.data;
  }

  // Update section content (admin only)
  // async updateSectionContent(section: string, data: UpdateContentRequest): Promise<ApiResponse<HomepageContent>> {
  //   const response = await api.put(`/api/homepage/content/${section}`, data);
  //   return response.data;
  // }

//   // Hero Slides Management (Admin only)
//   async getHeroSlides(): Promise<ApiResponse<HeroSlide[]>> {
//     const response = await api.get('/api/homepage/hero-slides');
//     return response.data;
//   }

//   async createHeroSlide(data: CreateHeroSlideRequest): Promise<ApiResponse<HeroSlide>> {
//     const response = await api.post('/api/homepage/hero-slides', data);
//     return response.data;
//   }

//   async createHeroSlideWithImage(data: Omit<CreateHeroSlideRequest, 'imageUrl'>, imageFile: File): Promise<ApiResponse<HeroSlide>> {
//     const formData = new FormData();
//     formData.append('title', data.title);
//     formData.append('subtitle', data.subtitle);
//     formData.append('ctaText', data.ctaText);
//     if (data.ctaLink) formData.append('ctaLink', data.ctaLink);
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     formData.append('image', imageFile);

//     const response = await api.post('/api/homepage/hero-slides/with-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async updateHeroSlide(id: number, data: UpdateHeroSlideRequest): Promise<ApiResponse<HeroSlide>> {
//     const response = await api.put(`/api/homepage/hero-slides/${id}`, data);
//     return response.data;
//   }

//   async updateHeroSlideWithImage(id: number, data: Omit<UpdateHeroSlideRequest, 'imageUrl'>, imageFile?: File): Promise<ApiResponse<HeroSlide>> {
//     const formData = new FormData();
//     if (data.title) formData.append('title', data.title);
//     if (data.subtitle) formData.append('subtitle', data.subtitle);
//     if (data.ctaText) formData.append('ctaText', data.ctaText);
//     if (data.ctaLink) formData.append('ctaLink', data.ctaLink);
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     if (imageFile) formData.append('image', imageFile);

//     const response = await api.put(`/api/homepage/hero-slides/${id}/with-image`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async deleteHeroSlide(id: number): Promise<ApiResponse<HeroSlide>> {
//     const response = await api.delete(`/api/homepage/hero-slides/${id}`);
//     return response.data;
//   }

//   // Testimonials Management (Admin only)
//   async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
//     const response = await api.get('/api/homepage/testimonials');
//     return response.data;
//   }

//   async createTestimonial(data: CreateTestimonialRequest): Promise<ApiResponse<Testimonial>> {
//     const response = await api.post('/api/homepage/testimonials', data);
//     return response.data;
//   }

//   async createTestimonialWithImage(data: Omit<CreateTestimonialRequest, 'avatarUrl'>, avatarFile?: File): Promise<ApiResponse<Testimonial>> {
//     const formData = new FormData();
//     formData.append('name', data.name);
//     formData.append('location', data.location);
//     formData.append('type', data.type);
//     formData.append('content', data.content);
//     if (data.rating !== undefined) formData.append('rating', data.rating.toString());
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     if (avatarFile) formData.append('image', avatarFile);

//     const response = await api.post('/api/homepage/testimonials/with-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async updateTestimonial(id: number, data: UpdateTestimonialRequest): Promise<ApiResponse<Testimonial>> {
//     const response = await api.put(`/api/homepage/testimonials/${id}`, data);
//     return response.data;
//   }

//   async updateTestimonialWithImage(id: number, data: Omit<UpdateTestimonialRequest, 'avatarUrl'>, avatarFile?: File): Promise<ApiResponse<Testimonial>> {
//     const formData = new FormData();
//     if (data.name) formData.append('name', data.name);
//     if (data.location) formData.append('location', data.location);
//     if (data.type) formData.append('type', data.type);
//     if (data.content) formData.append('content', data.content);
//     if (data.rating !== undefined) formData.append('rating', data.rating.toString());
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     if (avatarFile) formData.append('image', avatarFile);

//     const response = await api.put(`/api/homepage/testimonials/${id}/with-image`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async deleteTestimonial(id: number): Promise<ApiResponse<Testimonial>> {
//     const response = await api.delete(`/api/homepage/testimonials/${id}`);
//     return response.data;
//   }

//   // Clients Management (Admin only)
//   async getClients(): Promise<ApiResponse<Client[]>> {
//     const response = await api.get('/api/homepage/clients');
//     return response.data;
//   }

//   async createClient(data: CreateClientRequest): Promise<ApiResponse<Client>> {
//     const response = await api.post('/api/homepage/clients', data);
//     return response.data;
//   }

//   async createClientWithImage(data: Omit<CreateClientRequest, 'logoUrl'>, logoFile: File): Promise<ApiResponse<Client>> {
//     const formData = new FormData();
//     formData.append('name', data.name);
//     if (data.websiteUrl) formData.append('websiteUrl', data.websiteUrl);
//     if (data.description) formData.append('description', data.description);
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     formData.append('image', logoFile);

//     const response = await api.post('/api/homepage/clients/with-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async updateClient(id: number, data: UpdateClientRequest): Promise<ApiResponse<Client>> {
//     const response = await api.put(`/api/homepage/clients/${id}`, data);
//     return response.data;
//   }

//   async updateClientWithImage(id: number, data: Omit<UpdateClientRequest, 'logoUrl'>, logoFile?: File): Promise<ApiResponse<Client>> {
//     const formData = new FormData();
//     if (data.name) formData.append('name', data.name);
//     if (data.websiteUrl) formData.append('websiteUrl', data.websiteUrl);
//     if (data.description) formData.append('description', data.description);
//     if (data.position !== undefined) formData.append('position', data.position.toString());
//     if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
//     if (logoFile) formData.append('image', logoFile);

//     const response = await api.put(`/api/homepage/clients/${id}/with-image`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   // Upload main image for about section (admin only)
//   async uploadAboutMainImage(imageFile: File): Promise<ApiResponse<{ imageUrl: string }>> {
//     const formData = new FormData();
//     formData.append('image', imageFile);

//     const response = await api.post('/api/homepage/about/upload-main-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   // Upload gallery images for about section (admin only)
//   async uploadAboutGalleryImages(imageFiles: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> {
//     const formData = new FormData();
//     imageFiles.forEach(file => {
//       formData.append('images', file);
//     });

//     const response = await api.post('/api/homepage/about/upload-gallery-images', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async deleteClient(id: number): Promise<ApiResponse<Client>> {
//     const response = await api.delete(`/api/homepage/clients/${id}`);
//     return response.data;
//   }

//   // Footer Management (Admin only)
//   async getFooterSections(): Promise<ApiResponse<FooterSection[]>> {
//     const response = await api.get('/api/homepage/footer');
//     return response.data;
//   }

//   async updateFooterSection(section: string, data: UpdateFooterSectionRequest): Promise<ApiResponse<FooterSection>> {
//     const response = await api.put(`/api/homepage/footer/${section}`, data);
//     return response.data;
//   }

//   // Layout Management (Admin only)
//   async getSectionLayouts(): Promise<ApiResponse<SectionLayout[]>> {
//     const response = await api.get('/api/homepage/layout');
//     return response.data;
//   }

//   async updateSectionLayouts(data: UpdateLayoutRequest): Promise<ApiResponse<SectionLayout[]>> {
//     const response = await api.put('/api/homepage/layout', data);
//     return response.data;
//   }

//   async createDefaultLayouts(): Promise<ApiResponse<SectionLayout[]>> {
//     const response = await api.post('/api/homepage/layout/default');
//     return response.data;
//   }
}

const homepageService = new HomepageService();
export default homepageService;
