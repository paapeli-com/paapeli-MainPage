/**
 * API Configuration
 * Centralized API URL management using environment variables
 */

// Get API base URL from environment variables
// Defaults to production API if not set
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://api.paapeli.local';

/**
 * Construct full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/v1/devices')
 * @returns Full API URL
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Create fetch options with authentication headers
 * Since auth is handled by JWT tokens, we include the token
 * @param options - Additional fetch options
 * @returns Fetch options
 */
export function createAuthHeaders(options: RequestInit = {}): RequestInit {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    ...options,
    headers,
  };
}

/**
 * Make an authenticated API request
 * Handles auth redirects automatically on 401 responses
 * @param path - API endpoint path
 * @param options - Fetch options
 * @param redirectOnAuth - Whether to redirect on 401 (default: true)
 * @returns Promise<Response>
 */
export async function apiRequest(path: string, options: RequestInit = {}, redirectOnAuth: boolean = true): Promise<any> {
  const url = getApiUrl(path);
  const response = await fetch(url, createAuthHeaders(options));

  if (response.status === 401 && redirectOnAuth) {
    // Redirect to auth endpoint if not authenticated
    window.location.href = getApiUrl("/api/v1/users/me");
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
