import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;

// Catalogue API
import type { Catalogue } from "../types";

export async function fetchCatalogues(): Promise<Catalogue[]> {
  const res = await fetch("/api/catalogues");
  if (!res.ok) throw new Error("Failed to fetch catalogues");
  return res.json();
}

export async function createCatalogue(
  data: Partial<Catalogue>
): Promise<Catalogue> {
  const res = await fetch("/api/catalogues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create catalogue");
  return res.json();
}

export async function updateCatalogue(
  id: number,
  data: Partial<Catalogue>
): Promise<Catalogue> {
  const res = await fetch(`/api/catalogues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update catalogue");
  return res.json();
}

export async function deleteCatalogue(id: number): Promise<void> {
  const res = await fetch(`/api/catalogues/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete catalogue");
}
