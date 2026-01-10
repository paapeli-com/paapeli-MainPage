import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DevCenter from './DevCenter'

// Mock all dependencies
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key, // Return key as-is for testing
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/lib/api', () => ({
  apiRequest: vi.fn(() => Promise.resolve({ projects: [] })),
  getApiUrl: vi.fn((path: string) => `http://localhost:8080${path}`),
}))

// Mock fetch for health check
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 'ok', timestamp: '2026-01-10T01:00:00Z' }),
  } as Response)
)

describe('DevCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the DevCenter page', async () => {
    render(
      <BrowserRouter>
        <DevCenter />
      </BrowserRouter>
    )

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('API Health Status')).toBeInTheDocument()
    })

    expect(screen.getByText('Available API Endpoints')).toBeInTheDocument()
  })

  it('displays API endpoints', async () => {
    render(
      <BrowserRouter>
        <DevCenter />
      </BrowserRouter>
    )

    // Wait for the component to load and check for the endpoints section
    await waitFor(() => {
      expect(screen.getByText('Available API Endpoints')).toBeInTheDocument()
    })

    // Check that we have some endpoints rendered (at least one)
    const endpointElements = screen.getAllByText(/GET|POST/)
    expect(endpointElements.length).toBeGreaterThan(0)
  })

  it('displays SDK examples', async () => {
    render(
      <BrowserRouter>
        <DevCenter />
      </BrowserRouter>
    )

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Python Gateway')).toBeInTheDocument()
    })

    expect(screen.getByText('cURL Command')).toBeInTheDocument()
  })
})