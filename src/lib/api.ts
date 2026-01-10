/**
 * API Configuration
 * Centralized API URL management using environment variables
 */

// Get API base URL from environment variables
// For production, use the same origin (APISIX will route API calls)
// For development, use the configured API URL or relative URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Construct full API endpoint URL
 * @param path - API endpoint path (e.g., '/api/v1/devices')
 * @returns Full API URL
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanPath}`;
  } else {
    // Use relative URL (same origin)
    return cleanPath;
  }
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
    // Redirect to the SPA login page (not an API endpoint).
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = loginUrl;
    }
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    // Try to parse error response
    try {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || `API request failed: ${response.status} ${response.statusText}`);
    } catch (parseError) {
      // If we can't parse the error response, use the status text
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  }

  // Handle responses with no content (e.g., 204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
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

/**
 * AI Co-Pilot API functions
 */
export const aiAPI = {
  // Send chat message to AI
  sendMessage: (message: string, sessionId?: string) => apiRequest('/api/v1/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      session_id: sessionId
    })
  }),

  // Create new chat session
  createSession: (title?: string) => apiRequest('/api/v1/ai/sessions', {
    method: 'POST',
    body: JSON.stringify({
      title: title || 'New Chat Session'
    })
  }),

  // Get all chat sessions
  getSessions: () => apiRequest('/api/v1/ai/sessions'),

  // Get specific chat session
  getSession: (sessionId: string) => apiRequest(`/api/v1/ai/sessions/${sessionId}`),

  // Delete chat session
  deleteSession: (sessionId: string) => apiRequest(`/api/v1/ai/sessions/${sessionId}`, {
    method: 'DELETE'
  }),

  // Get quick actions
  getQuickActions: () => apiRequest('/api/v1/ai/quick-actions')
};
