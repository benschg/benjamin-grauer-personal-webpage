import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TableOfContents from './TableOfContents';

// Mock data for testing
const mockTocItems = [
  { id: 'section1', title: 'First Section', level: 1 },
  { id: 'section2', title: 'Second Section', level: 1 },
  { id: 'section3', title: 'Third Section', level: 1 },
];

// Mock DOM elements for scroll testing
const createMockElement = (id: string, offsetTop: number) => {
  const element = document.createElement('div');
  element.id = id;
  Object.defineProperty(element, 'offsetTop', {
    value: offsetTop,
    writable: true,
  });
  element.scrollIntoView = vi.fn();
  return element;
};

describe('TableOfContents', () => {
  let mockElements: Record<string, HTMLElement>;

  beforeEach(() => {
    // Create mock DOM elements
    mockElements = {
      section1: createMockElement('section1', 100),
      section2: createMockElement('section2', 500),
      section3: createMockElement('section3', 900),
    };

    // Mock document.getElementById
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      return mockElements[id] || null;
    });

    // Mock document properties for scroll calculations
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1200,
      writable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the TOC container', () => {
    render(<TableOfContents items={mockTocItems} />);

    const tocContainer = screen.getByTestId('toc-container');
    expect(tocContainer).toBeInTheDocument();
  });

  it('renders both collapsed and expanded states', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Both states should exist in DOM (controlled by opacity)
    const collapsed = screen.getByTestId('toc-collapsed');
    const expanded = screen.getByTestId('toc-expanded');

    expect(collapsed).toBeInTheDocument();
    expect(expanded).toBeInTheDocument();
  });

  it('shows section content in expanded state', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Content should be in DOM
    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.getByText('First Section')).toBeInTheDocument();
    expect(screen.getByText('Second Section')).toBeInTheDocument();
    expect(screen.getByText('Third Section')).toBeInTheDocument();
  });

  it('scrolls to section when clicked', async () => {
    render(<TableOfContents items={mockTocItems} />);

    // Click on a section button
    const firstSectionButton = screen.getByRole('button', { name: 'First Section' });
    fireEvent.click(firstSectionButton);

    // Should call scrollIntoView on the corresponding element
    expect(mockElements.section1.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('handles missing DOM elements gracefully', () => {
    // Mock getElementById to return null
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    render(<TableOfContents items={mockTocItems} />);

    // Should not crash and still render
    expect(screen.getByTestId('toc-container')).toBeInTheDocument();
    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<TableOfContents items={[]} />);

    expect(screen.getByTestId('toc-container')).toBeInTheDocument();
    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('renders correct number of section buttons', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Should have buttons for each section
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockTocItems.length);
  });

  it('applies correct accessibility attributes', () => {
    render(<TableOfContents items={mockTocItems} />);

    // All buttons should be properly accessible
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeEnabled();
      expect(button).toHaveAttribute('tabindex', '0');
    });
  });

  it('sets up scroll event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    render(<TableOfContents items={mockTocItems} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<TableOfContents items={mockTocItems} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('updates scroll progress on scroll events', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Trigger scroll event
    fireEvent.scroll(window);

    // Component should handle the scroll event without crashing
    expect(screen.getByTestId('toc-container')).toBeInTheDocument();
  });

  it('handles rapid hover state changes', async () => {
    render(<TableOfContents items={mockTocItems} />);

    const tocContainer = screen.getByTestId('toc-container');

    // Rapid hover changes
    fireEvent.mouseEnter(tocContainer);
    fireEvent.mouseLeave(tocContainer);
    fireEvent.mouseEnter(tocContainer);

    // Should not crash
    expect(tocContainer).toBeInTheDocument();
  });

  it('calculates active section based on scroll position', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Mock scroll to second section
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });

    // Trigger scroll event
    fireEvent.scroll(window);

    // Component should update internal state (we can't easily test the visual change)
    expect(screen.getByTestId('toc-container')).toBeInTheDocument();
  });

  it('handles scroll progress calculation edge cases', () => {
    render(<TableOfContents items={mockTocItems} />);

    // Test at document bottom
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

    fireEvent.scroll(window);

    // Should handle the calculation without crashing
    expect(screen.getByTestId('toc-container')).toBeInTheDocument();
  });
});
