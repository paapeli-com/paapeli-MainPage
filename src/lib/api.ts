/**
 * API Configuration
 * Centralized API URL management using environment variables
 */

// Get API base URL from environment variables
// For production, use the same origin (APISIX will route API calls)
// For development, use the configured API URL or relative URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API Data Types
export interface FirmwareVersionData {
  version: string;
  description?: string;
  fileUrl: string;
  checksum?: string;
  [key: string]: unknown;
}

export interface UpdateCampaignData {
  name: string;
  firmwareVersionId: string;
  deviceIds: string[];
  schedule?: string;
  [key: string]: unknown;
}

export interface ProjectData {
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface DeviceData {
  name: string;
  type: string;
  projectId: string;
  [key: string]: unknown;
}

export interface MemberData {
  email: string;
  role: string;
  projectId?: string;
  [key: string]: unknown;
}

export interface DeviceFirmwareStatusData {
  status: string;
  firmwareVersionId?: string;
  [key: string]: unknown;
}

export interface AlertParams {
  limit?: number;
  offset?: number;
  severity?: string;
  [key: string]: unknown;
}

export interface AlertData {
  title: string;
  description?: string;
  severity: string;
  deviceId?: string;
  [key: string]: unknown;
}

export interface GatewayData {
  name: string;
  description?: string;
  project_id: string;
  location?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Gateway {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  location?: string;
  status: 'online' | 'offline' | 'maintenance';
  config?: Record<string, unknown>;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface GatewayDevice {
  id: string;
  gateway_id: string;
  device_id: string;
  connected_at: string;
  disconnected_at?: string;
  name?: string;
  status?: string;
  last_heartbeat?: string;
}

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
export async function apiRequest(path: string, options: RequestInit = {}, redirectOnAuth: boolean = true): Promise<Response> {
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

  // Check Content-Type before parsing JSON to avoid parse errors
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`API returned non-JSON response: ${contentType || 'no content-type'}`);
  }

  return response.json();
}

/**
 * OTA API functions
 */
export const otaAPI = {
  // Firmware versions
  getFirmwareVersions: () => apiRequest('/api/v1/ota/firmware'),
  createFirmwareVersion: (data: FirmwareVersionData) => apiRequest('/api/v1/ota/firmware', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getFirmwareVersion: (id: string) => apiRequest(`/api/v1/ota/firmware/${id}`),
  updateFirmwareVersion: (id: string, data: Partial<FirmwareVersionData>) => apiRequest(`/api/v1/ota/firmware/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteFirmwareVersion: (id: string) => apiRequest(`/api/v1/ota/firmware/${id}`, {
    method: 'DELETE'
  }),

  // Update campaigns
  getUpdateCampaigns: () => apiRequest('/api/v1/ota/campaigns'),
  createUpdateCampaign: (data: UpdateCampaignData) => apiRequest('/api/v1/ota/campaigns', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getUpdateCampaign: (id: string) => apiRequest(`/api/v1/ota/campaigns/${id}`),
  updateUpdateCampaign: (id: string, data: Partial<UpdateCampaignData>) => apiRequest(`/api/v1/ota/campaigns/${id}`, {
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
  updateDeviceFirmwareStatus: (deviceId: string, data: DeviceFirmwareStatusData) => apiRequest(`/api/v1/ota/devices/${deviceId}/status`, {
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
  getAlerts: (params?: AlertParams) => apiRequest('/api/v1/alerts', { method: 'GET' }),
  // Get alert by ID
  getAlert: (id: string) => apiRequest(`/api/v1/alerts/${id}`),
  // Create alert
  createAlert: (data: AlertData) => apiRequest('/api/v1/alerts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  // Update alert
  updateAlert: (id: string, data: Partial<AlertData>) => apiRequest(`/api/v1/alerts/${id}`, {
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
 * User Management API functions
 */
export const userAPI = {
  // Update current user profile
  updateCurrentUser: (data: { username?: string; email?: string; password?: string; phone?: string; notifications_enabled?: boolean }) =>
    apiRequest('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Get current user
  getCurrentUser: () => apiRequest('/api/v1/users/me')
};

/**
 * Project Management API functions
 */
export const projectAPI = {
  // Get all projects for current user
  getProjects: () => apiRequest('/api/v1/projects'),

  // Create a new project
  createProject: (data: { name: string; description?: string }) =>
    apiRequest('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Get project details
  getProject: (id: string) => apiRequest(`/api/v1/projects/${id}`),

  // Update project
  updateProject: (id: string, data: { name?: string; description?: string }) =>
    apiRequest(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Delete project
  deleteProject: (id: string) => apiRequest(`/api/v1/projects/${id}`, {
    method: 'DELETE'
  }),

  // Get API keys for a project
  getProjectAPIKeys: (projectId: string) => apiRequest(`/api/v1/projects/${projectId}/api-keys`),

  // Create API key for a project
  createProjectAPIKey: (projectId: string, data: { name: string }) =>
    apiRequest(`/api/v1/projects/${projectId}/api-keys`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Delete API key
  deleteAPIKey: (apiKeyId: string) => apiRequest(`/api/v1/api-keys/${apiKeyId}`, {
    method: 'DELETE'
  })
};

/**
 * Gateway API functions
 */
export const gatewayAPI = {
  // Get all gateways
  getGateways: () => apiRequest('/api/v1/gateways'),

  // Create a new gateway
  createGateway: (data: GatewayData) => apiRequest('/api/v1/gateways', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Get gateway by ID
  getGateway: (id: string) => apiRequest(`/api/v1/gateways/${id}`),

  // Update gateway
  updateGateway: (id: string, data: Partial<GatewayData>) => apiRequest(`/api/v1/gateways/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Delete gateway
  deleteGateway: (id: string) => apiRequest(`/api/v1/gateways/${id}`, {
    method: 'DELETE'
  }),

  // Get devices for a gateway
  getGatewayDevices: (gatewayId: string) => apiRequest(`/api/v1/gateways/${gatewayId}/devices`)
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
