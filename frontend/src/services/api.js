// services/apiService.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables!');
}

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

  // ----------------- AUTH TOKEN -----------------
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

  // ----------------- CORE REQUEST -----------------
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
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
  register(userData) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.token) this.setAuthToken(data.token);
    return data;
  }

  async getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) return null;
    return this.request('/auth/me');
  }

  changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  logout() {
    this.removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  }

  // ----------------- USER / PROFILE -----------------
  getDashboard() {
    return this.request('/users/dashboard');
  }

  updateProfile(profileData) {
    return this.request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) });
  }

  getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  getMyItems() {
    return this.request('/users/my/items');
  }

  // ✅ Get user subscription
  async getSubscription() {
    const token = this.getAuthToken();
    if (!token) return null;
    return this.request('/users/subscription');
  }

  // ----------------- ITEMS -----------------
  getItems(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/items?${query}`);
  }

  getItem(id) {
    return this.request(`/items/${id}`);
  }

  getItemById(id) {
    return this.request(`/items/${id}`);
  }

  createItem(itemData) {
    return this.request('/items', { method: 'POST', body: JSON.stringify(itemData) });
  }

  updateItem(id, itemData) {
    return this.request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(itemData) });
  }

  deleteItem(id) {
    return this.request(`/items/${id}`, { method: 'DELETE' });
  }

  likeItem(itemId) {
    return this.request(`/items/${itemId}/like`, { method: 'POST' });
  }

  // ----------------- BIDDING -----------------
  placeBid(itemId, amount, message = null) {
    return this.request(`/items/${itemId}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount, message })
    });
  }

  // ----------------- MARKETPLACE -----------------
  getFeaturedItems() {
    return this.request('/items/featured/items');
  }

  getCategories() {
    return this.request('/items/categories/list');
  }

  searchItems(query, filters = {}) {
    return this.getItems({ search: query, ...filters });
  }

  getExchangeItems(filters = {}) {
    return this.getItems({ type: 'exchange', ...filters });
  }

  async getBiddingItems(filters = {}) {
    return this.getItems({ type: 'bidding', ...filters });
  }

  getResellItems(filters = {}) {
    return this.getItems({ type: 'resell', ...filters });
  }

  // ----------------- FILE UPLOAD -----------------
  async uploadSingleImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = this.getAuthToken();

    const res = await fetch(`${this.baseURL}/upload/single`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Upload failed: ${res.status}`);
    }

    return res.json();
  }

  async uploadMultipleImages(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const token = this.getAuthToken();

    const res = await fetch(`${this.baseURL}/upload/multiple`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Upload failed: ${res.status}`);
    }

    return res.json();
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const token = this.getAuthToken();

    const res = await fetch(`${this.baseURL}/upload/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Upload failed: ${res.status}`);
    }

    return res.json();
  }

  deleteImage(folder, filename) {
    return this.request(`/upload/delete/${folder}/${filename}`, { method: 'DELETE' });
  }

  // ✅ Backward compatibility
  async uploadImage(file) {
    return this.uploadSingleImage(file);
  }

  // ----------------- ADMIN -----------------
  // Dashboard stats
  getAdminStats() {
    return this.request('/admin/dashboard/stats');
  }

  // Subscriptions
  getAllSubscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/subscriptions?${query}`);
  }

  getPendingSubscriptions() {
    return this.request('/admin/subscriptions/pending');
  }

  getSubscriptionById(id) {
    return this.request(`/admin/subscriptions/${id}`);
  }

  approveSubscription(id, agentName, transactionId = null) {
    return this.request(`/admin/subscriptions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ agentName, transactionId })
    });
  }

  rejectSubscription(id, agentName, reason) {
    return this.request(`/admin/subscriptions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ agentName, reason })
    });
  }

  extendSubscription(id, months, agentName) {
    return this.request(`/admin/subscriptions/${id}/extend`, {
      method: 'POST',
      body: JSON.stringify({ months, agentName })
    });
  }

  cancelSubscription(id, agentName, reason) {
    return this.request(`/admin/subscriptions/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ agentName, reason })
    });
  }

  // Users
  getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${query}`);
  }

  getAdminUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  // ----------------- PAYMENT (Optional - for QR code feature) -----------------
  getPaymentInfo() {
    return this.request('/payment/payment-info');
  }

  generateQR(amount, note) {
    return this.request('/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({ amount, note })
    });
  }

  // ----------------- PAYMENT PROOF -----------------
  async uploadPaymentProof(subscriptionId, file, notes = null) {
    const formData = new FormData();
    formData.append('paymentProof', file);
    formData.append('subscriptionId', subscriptionId);
    if (notes) formData.append('notes', notes);

    const token = this.getAuthToken();
    const res = await fetch(`${this.baseURL}/payment-proofs/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Upload failed: ${res.status}`);
    }

    return res.json();
  }

  getPaymentProofs(subscriptionId) {
    return this.request(`/payment-proofs/subscription/${subscriptionId}`);
  }

  getMyPaymentProofs() {
    return this.request('/payment-proofs/my-proofs');
  }

  deletePaymentProof(id) {
    return this.request(`/payment-proofs/${id}`, { method: 'DELETE' });
  }

  // ----------------- HEALTH CHECK -----------------
  async healthCheck() {
    try {
      const res = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;
