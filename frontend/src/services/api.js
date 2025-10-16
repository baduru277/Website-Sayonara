// services/apiService.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://31.97.73.226:4000/api';

// Helper: serialize errors for logging
function serializeError(error) {
  if (!error) return { message: 'Unknown error' };
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack, cause: error.cause || null };
  }
  if (typeof error === 'object') return { ...error, message: error.message || 'Non-Error thrown' };
  return { message: String(error) };
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Auth token helpers
  getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
  setAuthToken(token) {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
  }
  removeAuthToken() {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
  }

  // Generic API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    const config = {
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...options.headers },
      ...options,
    };

    try {
      const res = await fetch(url, config);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!res.ok) {
        const err = new Error(data?.error || data?.message || `HTTP ${res.status}`);
        err.name = 'ApiError';
        err.cause = { status: res.status, body: data };
        throw err;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', serializeError(error));
      if (error.message.includes('Failed to fetch')) throw new Error('Unable to connect to server. Backend may be down.');
      throw error;
    }
  }

  // Auth
  register(userData) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); }
  async login(credentials) {
    const data = await this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.token) this.setAuthToken(data.token);
    return data;
  }
  getCurrentUser() { return this.request('/auth/me'); }
  updateProfile(profileData) { return this.request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }); }
  logout() { this.removeAuthToken(); }

  // Items
  getItems(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/items?${query}`);
  }
  getItem(id) { return this.request(`/items/${id}`); }
  createItem(itemData) { return this.request('/items', { method: 'POST', body: JSON.stringify(itemData) }); }
  updateItem(id, itemData) { return this.request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(itemData) }); }
  deleteItem(id) { return this.request(`/items/${id}`, { method: 'DELETE' }); }

  // Marketplace features
  placeBid(itemId, amount) { return this.request(`/items/${itemId}/bid`, { method: 'POST', body: JSON.stringify({ amount }) }); }
  getFeaturedItems() { return this.request('/items/featured/items'); }
  getCategories() { return this.request('/items/categories/list'); }
  searchItems(query, filters = {}) { return this.getItems({ search: query, ...filters }); }
  getExchangeItems(filters = {}) { return this.getItems({ type: 'exchange', ...filters }); }
  async getBiddingItems(filters = {}) {
    let res = await this.getItems({ type: 'bidding', ...filters });
    if (!res.items?.length) res = await this.getItems({ type: 'bid', ...filters });
    return res;
  }
  getResellItems(filters = {}) { return this.getItems({ type: 'resell', ...filters }); }

  // File upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = this.getAuthToken();

    const res = await fetch(`${this.baseURL}/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  }

  // Backend health
  async healthCheck() {
    try {
      const res = await fetch(`${this.baseURL.replace('/api','')}/health`);
      return res.ok;
    } catch { return false; }
  }
}

// Singleton
const apiService = new ApiService();
export default apiService;
