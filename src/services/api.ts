/// <reference types="vite/client" />
import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').trim().replace(/\/+$/, '');
export const BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // Tell the server we accept gzip — triggers compression middleware
    'Accept-Encoding': 'gzip, deflate, br',
  },
});

// ── In-memory auth token (avoids localStorage hit on every request) ────────────
let memoryToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  memoryToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

api.interceptors.request.use(
  (config: any) => {
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

// ── Request Deduplication ─────────────────────────────────────────────────────
// If two components mount simultaneously and call the same GET endpoint,
// this merges them into ONE network request — both get the same response.
// Eliminates redundant API calls on every route transition.
const inFlightRequests = new Map<string, Promise<any>>();

export function dedupedGet<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const key = url + (params ? JSON.stringify(params) : '');
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }
  const promise = api.get<T>(url, { params })
    .then(r => r.data)
    .finally(() => inFlightRequests.delete(key));
  inFlightRequests.set(key, promise);
  return promise;
}

// ── Stale-While-Revalidate Client Cache ───────────────────────────────────────
// Serves a cached response INSTANTLY (0ms) while revalidating in the background.
// After TTL expires the next caller gets fresh data; everyone else gets instant cache.
// This is why navigating between pages feels instant after first load.
interface CacheEntry { data: any; cachedAt: number; }
const memoryCache = new Map<string, CacheEntry>();

export function swrGet<T = any>(url: string, ttlMs: number, params?: Record<string, any>): Promise<T> {
  const key = url + (params ? JSON.stringify(params) : '');
  const entry = memoryCache.get(key);
  const now = Date.now();

  if (entry) {
    const age = now - entry.cachedAt;
    if (age < ttlMs) {
      // Fresh: serve from cache instantly
      return Promise.resolve(entry.data as T);
    }
    // Stale: serve old data immediately AND kick off background refresh
    dedupedGet<T>(url, params).then(fresh => {
      memoryCache.set(key, { data: fresh, cachedAt: Date.now() });
    }).catch(() => {}); // Silent — old data stays if refresh fails
    return Promise.resolve(entry.data as T);
  }

  // No cache yet: fetch and cache
  return dedupedGet<T>(url, params).then(data => {
    memoryCache.set(key, { data, cachedAt: Date.now() });
    return data;
  });
}

/** Invalidate a cached entry (call after mutations like order creation) */
export function invalidateCache(urlPrefix: string) {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(urlPrefix)) memoryCache.delete(key);
  }
}

// ── Cloudinary Upload ─────────────────────────────────────────────────────────
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
    headers: memoryToken ? { Authorization: `Bearer ${memoryToken}` } : {},
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.url;
};

export default api;
