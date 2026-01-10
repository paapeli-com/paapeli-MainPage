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

/**
 * OTA API functions
 */
export const otaAPI = {
  // Firmware versions
  getFirmwareVersions: () => apiRequest('/api/v1/ota/firmware'),
  createFirmwareVersion: (data: any) => apiRequest('/api/v1/ota/firmware', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFirmwareVersion: (id: string) => apiRequest(`/api/v1/ota/firmware/${id}`),
  updateFirmwareVersion: (id: string, data: any) => apiRequest(`/api/v1/ota/firmware/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteFirmwareVersion: (id: string) => apiRequest(`/api/v1/ota/firmware/${id}`, {
    method: 'DELETE'
  }),

  // Update campaigns
  getUpdateCampaigns: () => apiRequest('/api/v1/ota/campaigns'),
  createUpdateCampaign: (data: any) => apiRequest('/api/v1/ota/campaigns', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getUpdateCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}`),
  updateUpdateCampaign: (id: string, data: any) => apiRequest(`/api/v1/ota/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteUpdateCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}`, {
    method: 'DELETE'
  }),
  startCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}/start`, { method: 'POST' }),
  pauseCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}/pause`, { method: 'POST' }),
  cancelCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}/cancel`, { method: 'POST' }),
  completeCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}/complete`, { method: 'POST' }),

  // Device firmware status
  getDeviceFirmwareStatus: (deviceId: string) => apiRequest(`/api/v1/ota/devices/${deviceId}/status`),
  getAllDeviceFirmwareStatuses: () => apiRequest('/api/v1/ota/devices/status'),
  updateDeviceFirmwareStatus: (deviceId: string, data: any) => apiRequest(`/api/v1/ota/devices/${deviceId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Firmware update history
  getFirmwareUpdateHistory: () => apiRequest('/api/v1/ota/history')
};

/**
 * Alerts API functions
 */
export const alertsAPI = {
  // Get alerts count for dashboard
  getAlertsCount: () => apiRequest('/api/v1/alerts/count'),
  // Get all alerts
  getAlerts: (params?: any) => apiRequest('/api/v1/alerts', { method: 'GET' }),
  // Get alert by ID
  getAlert: (id: string) => apiRequest(`/api/v1/alerts/${id}`),
  // Create alert
  createAlert: (data: any) => apiRequest('/api/v1/alerts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  // Update alert
  updateAlert: (id: string, data: any) => apiRequest(`/api/v1/alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  // Delete alert
  deleteAlert: (id: string) => apiRequest(`/api/v1/alerts/${id}`, {
    method: 'DELETE'
  }),
  // Acknowledge alert
  acknowledgeAlert: (id: string) => apiRequest(`/api/v1/alerts/${id}/acknowledge`, {
    method: 'POST'
  })
};
