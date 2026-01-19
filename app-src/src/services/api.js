/**
 * CIVIQ API Service
 * Handles all communication with the PHP backend
 */

const API_BASE = '/sud/claude/civiq/api';

// Get session token from localStorage
const getToken = () => localStorage.getItem('civiq_token');
const setToken = (token) => localStorage.setItem('civiq_token', token);
const clearToken = () => localStorage.removeItem('civiq_token');

// API request helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'X-Session-Token': token }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth API
export const auth = {
  async register(email, password, zipCode) {
    const data = await apiRequest('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ email, password, zip_code: zipCode }),
    });
    if (data.session_token) {
      setToken(data.session_token);
    }
    return data;
  },

  async login(email, password) {
    const data = await apiRequest('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.session_token) {
      setToken(data.session_token);
    }
    return data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout.php', { method: 'POST' });
    } finally {
      clearToken();
    }
  },

  async getSession() {
    if (!getToken()) return null;
    try {
      const data = await apiRequest('/auth/session.php');
      return data.authenticated ? data : null;
    } catch {
      clearToken();
      return null;
    }
  },

  isLoggedIn() {
    return !!getToken();
  },
};

// Civic API
export const civic = {
  async getRepresentatives(address) {
    const params = address ? `?address=${encodeURIComponent(address)}` : '';
    return apiRequest(`/civic/representatives.php${params}`);
  },
};

// News API
export const news = {
  async getFeed(options = {}) {
    const params = new URLSearchParams();
    if (options.state) params.set('state', options.state);
    if (options.level) params.set('level', options.level);
    if (options.limit) params.set('limit', options.limit);
    const query = params.toString();
    return apiRequest(`/news/feed.php${query ? `?${query}` : ''}`);
  },
};

// User API
export const user = {
  async updatePreferences(preferences) {
    return apiRequest('/user/preferences.php', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  },

  async recordRead(article) {
    return apiRequest('/user/read.php', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  },
};

export default { auth, civic, news, user };
