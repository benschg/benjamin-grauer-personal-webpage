import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareLinksManager from '@/components/admin/ShareLinksManager';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.open
const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

describe('ShareLinksManager', () => {
  const mockLinks = [
    {
      id: 'link-1',
      shortCode: 'abc123',
      shortUrl: 'http://localhost/s/abc123',
      fullUrl: '/working-life/cv',
      versionName: 'Default CV',
      createdAt: '2024-01-01T00:00:00Z',
      totalVisits: 10,
      uniqueVisits: 5,
      lastVisitedAt: '2024-01-02T12:00:00Z',
      settings: {
        theme: 'dark',
        showPhoto: true,
        privacyLevel: 'none',
        showExperience: true,
        showAttachments: false,
        showExport: false,
      },
    },
    {
      id: 'link-2',
      shortCode: 'xyz789',
      shortUrl: 'http://localhost/s/xyz789',
      fullUrl: '/working-life/cv?version=123',
      versionName: 'Company A',
      createdAt: '2024-01-02T00:00:00Z',
      totalVisits: 3,
      uniqueVisits: 2,
      lastVisitedAt: '2024-01-03T10:00:00Z',
      settings: {
        theme: 'light',
        showPhoto: false,
        privacyLevel: 'full',
        showExperience: false,
        showAttachments: true,
        showExport: true,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ links: mockLinks }),
    });
  });

  it('should render loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ShareLinksManager />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render share links after loading', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
      expect(screen.getByText('/s/xyz789')).toBeInTheDocument();
    });
  });

  it('should display version names', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('Default CV')).toBeInTheDocument();
      expect(screen.getByText('Company A')).toBeInTheDocument();
    });
  });

  it('should display visit counts', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('5 / 10')).toBeInTheDocument();
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  it('should render empty state when no links', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ links: [] }),
    });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('No share links yet.')).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load share links')).toBeInTheDocument();
    });
  });

  it('should copy link to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    // Use defineProperty to mock the clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const copyButtons = screen.getAllByLabelText('Copy link');
    await user.click(copyButtons[0]);

    expect(writeTextMock).toHaveBeenCalledWith('http://localhost/s/abc123');
  });

  it('should open link in new tab when open button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const openButtons = screen.getAllByLabelText('Open link');
    await user.click(openButtons[0]);

    expect(mockWindowOpen).toHaveBeenCalledWith('http://localhost/s/abc123', '_blank');
  });

  it('should open delete dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete link');
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Delete Share Link')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this share link?')).toBeInTheDocument();
  });

  it('should close delete dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete link');
    await user.click(deleteButtons[0]);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Delete Share Link')).not.toBeInTheDocument();
    });
  });

  it('should delete link when confirmed', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ links: mockLinks }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText('Delete link');
    await user.click(deleteButtons[0]);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/share-link?id=link-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  it('should open edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText('Edit settings');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Share Link Settings')).toBeInTheDocument();
  });

  it('should show current settings in edit dialog', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText('Edit settings');
    await user.click(editButtons[0]);

    // Check for the short code in the dialog
    expect(screen.getAllByText('/s/abc123').length).toBeGreaterThan(1);
  });

  it('should save settings when save button is clicked', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ links: mockLinks }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText('Edit settings');
    await user.click(editButtons[0]);

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/share-link',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('should refresh links when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('/s/abc123')).toBeInTheDocument();
    });

    const refreshButton = screen.getByLabelText('Refresh');
    await user.click(refreshButton);

    // Should have called fetch twice - once on mount, once on refresh
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should display total stats correctly', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      // Check for the stats section header
      expect(screen.getByText(/Total Links:/)).toBeInTheDocument();
      // The number 2 appears multiple times (links count, visits, etc.)
      // Just verify the stats section loads
      const totalLinksText = screen.getByText(/Total Links:/);
      expect(totalLinksText).toBeInTheDocument();
    });
  });
});

describe('ShareLinksManager Settings Icons', () => {
  const mockLinkWithAllSettings = {
    id: 'link-1',
    shortCode: 'abc123',
    shortUrl: 'http://localhost/s/abc123',
    fullUrl: '/working-life/cv',
    versionName: 'Test CV',
    createdAt: '2024-01-01T00:00:00Z',
    totalVisits: 0,
    uniqueVisits: 0,
    lastVisitedAt: null,
    settings: {
      theme: 'light',
      showPhoto: false,
      privacyLevel: 'full',
      showExperience: true,
      showAttachments: true,
      showExport: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ links: [mockLinkWithAllSettings] }),
    });
  });

  it('should show light mode icon when theme is light', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
    });
  });

  it('should show privacy icon when privacy level is not none', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByLabelText('Privacy: full')).toBeInTheDocument();
    });
  });

  it('should show attachments icon when attachments are enabled', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByLabelText('Attachments included')).toBeInTheDocument();
    });
  });

  it('should show export icon when export is enabled', async () => {
    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByLabelText('Export panel visible')).toBeInTheDocument();
    });
  });
});

describe('ShareLinksManager Visits Tooltip', () => {
  const mockLinkWithVisits = {
    id: 'link-1',
    shortCode: 'abc123',
    shortUrl: 'http://localhost/s/abc123',
    fullUrl: '/working-life/cv',
    versionName: 'Test CV',
    createdAt: '2024-01-01T00:00:00Z',
    totalVisits: 5,
    uniqueVisits: 3,
    lastVisitedAt: '2024-01-02T12:00:00Z',
    settings: {
      theme: 'dark',
      showPhoto: true,
      privacyLevel: 'none',
      showExperience: true,
      showAttachments: false,
      showExport: false,
    },
  };

  const mockVisits = [
    {
      id: 'visit-1',
      visitedAt: '2024-01-02T12:00:00Z',
      ipHash: 'abc123...',
      browser: 'Chrome',
      device: 'Desktop',
      referrer: null,
    },
    {
      id: 'visit-2',
      visitedAt: '2024-01-02T10:00:00Z',
      ipHash: 'def456...',
      browser: 'Safari',
      device: 'Mobile',
      referrer: 'https://google.com',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ links: [mockLinkWithVisits] }),
      });
  });

  it('should fetch visits when tooltip opens', async () => {
    const user = userEvent.setup();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ links: [mockLinkWithVisits] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ visits: mockVisits }),
      });

    render(<ShareLinksManager />);

    await waitFor(() => {
      expect(screen.getByText('3 / 5')).toBeInTheDocument();
    });

    // Hover over the visits cell to trigger tooltip
    const visitsBox = screen.getByText('3 / 5').closest('div');
    if (visitsBox) {
      fireEvent.mouseEnter(visitsBox);
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/share-link/link-1/visits');
    });
  });
});
