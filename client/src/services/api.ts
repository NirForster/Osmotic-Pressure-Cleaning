import axios from "axios";

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set via environment variable, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production (deployed), use the Render backend URL
  if (import.meta.env.PROD || window.location.hostname !== "localhost") {
    return "https://osmotic-pressure-cleaning.onrender.com/api";
  }
  
  // Development fallback
  return "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();

export interface Product {
  id: string;
  name: string;
  url: string;
  sku: string;
  images: string[];
  previewImage: string;
  categoryId: string;
  categoryName: string;
  description: string;
  pdfUrl?: string;
  videoUrl?: string;
  subHeader?: string;
  bulletPoints?: string[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

const api = {
  // Get products with optional filtering
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<ProductsResponse> {
    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  },

  // Get a single product by ID
  async getProductById(
    id: string
  ): Promise<{ success: boolean; data: Product }> {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Get all categories
  async getCategories(): Promise<CategoriesResponse> {
    const response = await axios.get(`${API_BASE_URL}/products/categories/all`);
    return response.data;
  },
};

export default api;
