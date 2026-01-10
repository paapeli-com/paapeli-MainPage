import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PanelHome from './PanelHome';
import { apiRequest, alertsAPI } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  apiRequest: vi.fn(),
  alertsAPI: {
    getAlertsCount: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the language context
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

// Mock the PanelLayout
vi.mock('@/layouts/PanelLayout', () => ({
  PanelLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="panel-layout">{children}</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PanelHome Component', () => {
  const mockGatewaysData = {
    gateways: [
      { id: '1', name: 'Gateway 1', status: 'active' },
      { id: '2', name: 'Gateway 2', status: 'inactive' },
      { id: '3', name: 'Gateway 3', status: 'active' },
    ]
  };

  const mockAlertsCount = { count: 5 };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (apiRequest as any).mockResolvedValue(mockGatewaysData);
    (alertsAPI.getAlertsCount as any).mockResolvedValue(mockAlertsCount);
  });

  it('renders the dashboard', async () => {
    render(<PanelHome />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('panel-layout')).toBeInTheDocument();
    });
  });

  it('loads and displays stats correctly', async () => {
    render(<PanelHome />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // totalDevices
      expect(screen.getByText('2')).toBeInTheDocument(); // activeDevices
      expect(screen.getByText('5')).toBeInTheDocument(); // alerts
    });
  });

  it('calls the correct APIs', async () => {
    render(<PanelHome />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith("/api/v1/gateways");
      expect(alertsAPI.getAlertsCount).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    (apiRequest as any).mockRejectedValue(new Error('API Error'));
    (alertsAPI.getAlertsCount as any).mockRejectedValue(new Error('Alerts API Error'));

    render(<PanelHome />, { wrapper: createWrapper() });

    // Wait for loading to complete
    await waitFor(() => {
      // Should show 0s after API errors
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThanOrEqual(3); // totalDevices, activeDevices, alerts
    });
  });

  it('handles alerts API error while gateways API succeeds', async () => {
    (alertsAPI.getAlertsCount as any).mockRejectedValue(new Error('Alerts API Error'));

    render(<PanelHome />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // totalDevices
      expect(screen.getByText('2')).toBeInTheDocument(); // activeDevices
      expect(screen.getByText('0')).toBeInTheDocument(); // alerts should be 0 due to error
    });
  });

  it('shows loading state initially', async () => {
    render(<PanelHome />, { wrapper: createWrapper() });

    // Initially should show loading dots
    expect(screen.getAllByText('...')).toHaveLength(3);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});