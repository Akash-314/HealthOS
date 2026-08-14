const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Generic API fetch helper for backend communication.
 * @param {string} endpoint - API endpoint path (e.g. '/health')
 * @param {RequestInit} [options] - Fetch request options
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Request failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetch Backend System Health Status
 */
export async function checkBackendHealth() {
  return apiFetch('/health');
}
