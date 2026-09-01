/// <reference types="vite/client" />
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let memoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  memoryToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

const token = localStorage.getItem('auth_token');
if (token) memoryToken = token;

api.interceptors.request.use(
  (config: any) => {
    if (!memoryToken) {
      const stored = localStorage.getItem('auth_token');
      if (stored) memoryToken = stored;
    }
    if (memoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      return Promise.reject(error);
    }

    // Don't retry client errors (4xx) — only retry network failures and server errors (5xx)
    const isNetworkError = !error.response;
    const isServerError = error.response?.status >= 500;
    if (!isNetworkError && !isServerError) return Promise.reject(error);

    const config = error.config as any;
    if (!config || config._retryCount >= 2) return Promise.reject(error);

    config._retryCount = (config._retryCount || 0) + 1;
    const delayMs = config._retryCount * 1000; // 1s, then 2s
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return api(config);
  }
);

// Upload a local image file through the backend to Cloudinary
export const uploadImageToCloudinary = async (file: File | string | null | undefined): Promise<string> => {
  if (!file) return '';
  if (typeof file === 'string') {
    return file; // Already a remote URL or empty
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.url;
};

export default api;
