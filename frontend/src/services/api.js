const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://31.97.73.226:4000/api';

// Ensure errors are logged with useful, serializable details (Next.js can hide non-enumerables)
function serializeErrorForLogging(originalError) {
  try {
    if (!originalError) {
      return { message: 'Unknown error' };
    }
    // Handle native Error instances
    if (originalError instanceof Error) {
      const base = {
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack,
      };
      // Optional cause (may not be supported in all runtimes)
      const cause = originalError.cause;
      if (cause) {
        // Avoid deep/circular structures
        base.cause = typeof cause === 'object' && cause !== null
          ? Object.fromEntries(Object.entries(cause).slice(0, 10))
          : String(cause);
      }
      return base;
    }
    // Handle plain objects
    if (typeof originalError === 'object') {
      const shallowCopy = {};
      Object.keys(originalError).slice(0, 10).forEach((key) => {
        const value = originalError[key];
        shallowCopy[key] = typeof value === 'object' && value !== null ? '[object]' : value;
      });
      // Provide a fallback message if none exists
      if (!('message' in shallowCopy)) {
        shallowCopy.message = 'Non-Error thrown';
      }
      return shallowCopy;
    }
    // Primitives
    return { message: String(originalError) };
  } catch (e) {
    return { message: 'Failed to serialize error', detail: String(e) };
  }
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Helper method to remove auth token
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        // Read the raw body first to allow flexible parsing and better diagnostics
        let rawErrorBody = '';
        try {
          rawErrorBody = await response.text();
        } catch {
          // ignore
        }

        let errorData = {};
        if (rawErrorBody) {
          try {
            errorData = JSON.parse(rawErrorBody);
          } catch {
            errorData = { error: rawErrorBody };
          }
        } else {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }

        const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        console.error('API error response:', {
          url,
          method: config.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        });

        const apiError = new Error(errorMessage);
        apiError.name = 'ApiError';
        apiError.cause = {
          url,
          method: config.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        };
        throw apiError;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.log('Could not parse response as JSON, treating as text');
        data = await response.text();
      }
      
      console.log('API response:', data);
      return data;
    } catch (error) {
      // Log a fully-serializable error object so dev overlays don't collapse it to {}
      const serialized = serializeErrorForLogging(error);
      const logPayload = {
        url,
        method: config.method || 'GET',
        error: serialized,
      };
      // Log both as object and as JSON string for environments that hide non-enumerables
      console.error('API request failed:', logPayload);
      console.error('API request failed (stringified):', JSON.stringify(logPayload));

      // Provide more helpful error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    return response.user || response;
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  logout() {
    this.removeAuthToken();
  }

  // Items methods
  async getItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/items?${queryString}`);
  }

  async getItem(id) {
    return this.request(`/items/${id}`);
  }

  async getItemById(id) {
    return this.request(`/items/${id}`);
  }

  async createItem(itemData) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(id, itemData) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  async placeBid(itemId, amount) {
    return this.request(`/items/${itemId}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getFeaturedItems() {
    return this.request('/items/featured/items');
  }

  async getCategories() {
    return this.request('/items/categories/list');
  }

  // Search methods
  async searchItems(query, filters = {}) {
    const params = { search: query, ...filters };
    return this.getItems(params);
  }

  // Exchange specific methods
  async getExchangeItems(filters = {}) {
    return this.getItems({ type: 'exchange', ...filters });
  }

  // Bidding specific methods
  async getBiddingItems(filters = {}) {
    // Handle both 'bid' and 'bidding' types for backward compatibility
    const response = await this.getItems({ type: 'bidding', ...filters });
    
    // If no items found with 'bidding' type, try 'bid' type
    if (!response.items || response.items.length === 0) {
      const bidResponse = await this.getItems({ type: 'bid', ...filters });
      return bidResponse;
    }
    
    return response;
  }

  // Resell specific methods
  async getResellItems(filters = {}) {
    return this.getItems({ type: 'resell', ...filters });
  }

  // File upload helper (for images)
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = this.getAuthToken();
    
    try {
      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 
