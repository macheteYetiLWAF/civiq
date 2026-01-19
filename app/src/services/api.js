/**
 * CIVIQ API Service
 * Handles all API communication with the backend
 */
import { Capacitor } from '@capacitor/core';

// Use full URL for native apps, relative for web
const API_BASE = Capacitor.isNativePlatform()
  ? 'https://fitaf570.com/sud/claude/civiq/api'
  : '/api';

// Session token storage
let sessionToken = localStorage.getItem('civiq_session_token');

/**
 * Set the session token (after login)
 */
export function setSessionToken(token) {
  sessionToken = token;
  if (token) {
    localStorage.setItem('civiq_session_token', token);
  } else {
    localStorage.removeItem('civiq_session_token');
  }
}

/**
 * Get current session token
 */
export function getSessionToken() {
  return sessionToken;
}

/**
 * Base fetch wrapper with auth headers
 * Uses native HTTP when running on device (via CapacitorHttp plugin)
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (sessionToken) {
    headers['X-Session-Token'] = sessionToken;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (fetchError) {
    // Log detailed error for debugging native app issues
    console.error('Fetch failed:', {
      url,
      error: fetchError.message,
      isNative: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform()
    });
    throw new Error(`Network error: ${fetchError.message}. URL: ${url}`);
  }

  // Get response text first to handle empty/invalid JSON
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('API JSON parse error:', e, 'Response:', text.substring(0, 200));
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ============ AUTH ============

/**
 * Register a new user
 */
export async function register({ email, password, displayName, zipCode, divisions, normalizedAddress, coordinates }) {
  const data = await apiFetch('/auth/register.php', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      display_name: displayName,
      zip_code: zipCode,
      divisions: divisions || [],
      normalized_address: normalizedAddress || null,
      coordinates: coordinates || null
    }),
  });

  if (data.session_token) {
    setSessionToken(data.session_token);
  }

  return data;
}

/**
 * Login with email/password
 */
export async function login({ email, password }) {
  const data = await apiFetch('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.session_token) {
    setSessionToken(data.session_token);
  }

  return data;
}

/**
 * Logout current session
 */
export async function logout() {
  try {
    await apiFetch('/auth/logout.php', { method: 'POST' });
  } finally {
    setSessionToken(null);
  }
}

/**
 * Get current session info
 */
export async function getSession() {
  return apiFetch('/auth/session.php');
}

// ============ VOICES ============

/**
 * Get voices feed
 * @param {Object} options - { tier, type, limit, offset }
 */
export async function getVoices(options = {}) {
  const params = new URLSearchParams();
  if (options.tier) params.set('tier', options.tier);
  if (options.type) params.set('type', options.type);
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);

  const query = params.toString();
  return apiFetch(`/voices/feed.php${query ? '?' + query : ''}`);
}

// ============ NEWS ============

/**
 * Get news feed
 */
export async function getNewsFeed(options = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);

  const query = params.toString();
  return apiFetch(`/news/feed.php${query ? '?' + query : ''}`);
}

// ============ GEO ============

/**
 * Geocode an address (via backend proxy)
 */
export async function geocode(address) {
  return apiFetch(`/geo/geocode.php?address=${encodeURIComponent(address)}`);
}

// ============ CIVIC ============

/**
 * Get representatives for an address
 */
export async function getRepresentatives(address) {
  return apiFetch(`/civic/representatives.php?address=${encodeURIComponent(address)}`);
}

/**
 * Get divisions for an address
 */
export async function getDivisions(address) {
  return apiFetch(`/civic/divisions.php?address=${encodeURIComponent(address)}`);
}

/**
 * Get all elected officials
 * Returns officials grouped by level (federal, state, local)
 */
export async function getOfficials() {
  return apiFetch('/civic/officials.php');
}

// ============ TIMELINE ============

/**
 * Get historical timeline events
 */
export async function getTimelineEvents(options = {}) {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.search) params.set('search', options.search);
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);

  const query = params.toString();
  return apiFetch(`/timeline/events.php${query ? '?' + query : ''}`);
}

// ============ BILLS ============

/**
 * Get bills feed
 * @param {Object} options - { level, status, chamber, limit, offset }
 */
export async function getBills(options = {}) {
  const params = new URLSearchParams();
  if (options.level) params.set('level', options.level);
  if (options.status) params.set('status', options.status);
  if (options.chamber) params.set('chamber', options.chamber);
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);

  const query = params.toString();
  return apiFetch(`/bills/feed.php${query ? '?' + query : ''}`);
}

// ============ SOURCES ============

/**
 * Get news sources
 */
export async function getSources() {
  return apiFetch('/sources.php');
}

/**
 * Get news sources with bias data
 */
export async function getNewsSources() {
  return apiFetch('/news/sources.php');
}

/**
 * Follow/unfollow a news source
 */
export async function toggleFollowSource(sourceId, follow = true) {
  return apiFetch('/news/follow-source.php', {
    method: 'POST',
    body: JSON.stringify({ source_id: sourceId, follow }),
  });
}

export default {
  setSessionToken,
  getSessionToken,
  register,
  login,
  logout,
  getSession,
  getVoices,
  getNewsFeed,
  geocode,
  getRepresentatives,
  getDivisions,
  getOfficials,
  getTimelineEvents,
  getBills,
  getSources,
  getNewsSources,
  toggleFollowSource,
};
