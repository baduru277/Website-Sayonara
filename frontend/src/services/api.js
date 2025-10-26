// services/apiService.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables!');
}

// Helper: serialize errors for logging
function serializeError(error: any) {
  if (!error) return { message: 'Unknown error' };
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack, cause: error.cause || null };
  }
  if (typeof error === 'object') return { ...error, message: error.message || 'Non-Error thrown' };
  return { message: String(error) };
}

class ApiService {
  baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ----------------- AUTH TOKEN -----------------
  getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  setAuthToken(token: string) {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
  }

  removeAuthToken() {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
  }

  // ----------------- CORE REQUEST -----------------
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
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

  // ----------------- AUTH -----------------
  register(userData: any) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  }

  async login(credentials: any) {
    const data = await this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.token) this.setAuthToken(data.token);
    return data;
  }

  async getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) return null; // <- safe fallback if not logged in
    return this.request('/auth/me');
  }

  updateProfile(profileData: any) {
    return this.request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) });
  }

  logout() {
    this.removeAuthToken();
  }

  // ----------------- ITEMS -----------------
  getItems(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/items?${query}`);
  }

  getItem(id: string) { return this.request(`/items/${id}`); }
  getItemById(id: string) { return this.request(`/items/${id}`); }

  createItem(itemData: any) { return this.request('/items', { method: 'POST', body: JSON.stringify(itemData) }); }
  updateItem(id: string, itemData: any) { return this.request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(itemData) }); }
  deleteItem(id: string) { return this.request(`/items/${id}`, { method: 'DELETE' }); }

  // ----------------- MARKETPLACE -----------------
  placeBid(itemId: string, amount: number) { return this.request(`/items/${itemId}/bid`, { method: 'POST', body: JSON.stringify({ amount }) }); }
  getFeaturedItems() { return this.request('/items/featured/items'); }
  getCategories() { return this.request('/items/categories/list'); }
  searchItems(query: string, filters: any = {}) { return this.getItems({ search: query, ...filters }); }
  getExchangeItems(filters: any = {}) { return this.getItems({ type: 'exchange', ...filters }); }

  async getBiddingItems(filters: any = {}) {
    let res = await this.getItems({ type: 'bidding', ...filters });
    if (!res.items?.length) res = await this.getItems({ type: 'bid', ...filters });
    return res;
  }

  getResellItems(filters: any = {}) { return this.getItems({ type: 'resell', ...filters }); }

  // ----------------- FILE UPLOAD -----------------
  async uploadImage(file: File) {
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

  // ----------------- HEALTH CHECK -----------------
  async healthCheck() {
    try {
      const res = await fetch(`${this.baseURL.replace('/api','')}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;
