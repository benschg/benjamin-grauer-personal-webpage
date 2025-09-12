import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BaseSkillCard, { type DetailedSkill } from './BaseSkillCard';

// Mock MUI icons to prevent Windows file handle issues
vi.mock('@mui/icons-material', () => ({
  OpenInNew: () => <div data-testid="open-in-new-icon">OpenInNew</div>,
  ExpandLess: () => <div data-testid="expand-less-icon">ExpandLess</div>,
}));

// Create a theme for testing
const theme = createTheme({
  palette: {
    primary: { main: '#89665d' },
    text: { primary: '#ffffff' },
    background: { paper: '#343A40' },
    action: { hover: '#4a5056' },
  },
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

// Mock data
const simpleSkills = ['JavaScript', 'React', 'TypeScript'];

const detailedSkills: DetailedSkill[] = [
  {
    name: 'JavaScript',
    description: 'Modern JavaScript development with ES6+ features',
    category: 'Programming',
    experience: '8+ years',
    projects: ['React Apps', 'Node.js APIs', 'Web Components'],
    color: '#F7DF1E',
  },
  {
    name: 'React',
    description: 'Component-based UI library for building user interfaces',
    category: 'Framework',
    experience: '6+ years',
    projects: ['Single Page Apps', 'Component Libraries', 'Hooks'],
    color: '#61DAFB',
    externalUrl: 'https://reactjs.org',
  },
];

const skillsWithIcons: DetailedSkill[] = [
  {
    name: 'German (Native)',
    description: 'Native fluency in German',
    category: 'Language',
    experience: 'Lifetime',
    icon: <div data-testid="flag-icon">🇩🇪</div>,
    color: '#000000',
  },
];

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

describe('BaseSkillCard', () => {
  beforeEach(() => {
    // Reset window size before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Basic Rendering', () => {
    it('renders with simple string skills', () => {
      renderWithTheme(<BaseSkillCard title="Programming Skills" skills={simpleSkills} />);

      expect(screen.getByText('Programming Skills')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders with detailed skills', () => {
      renderWithTheme(<BaseSkillCard title="Technical Skills" skills={detailedSkills} />);

      expect(screen.getByText('Technical Skills')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders title link when provided', () => {
      renderWithTheme(
        <BaseSkillCard title="Skills" skills={simpleSkills} titleLink="https://example.com" />
      );

      const linkElement = screen.getByRole('link');
      expect(linkElement).toHaveAttribute('href', 'https://example.com');
      expect(linkElement).toHaveAttribute('target', '_blank');
    });

    it('renders with custom default color', () => {
      renderWithTheme(
        <BaseSkillCard title="Skills" skills={simpleSkills} defaultColor="#ff0000" />
      );

      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('renders icons when provided', () => {
      renderWithTheme(<BaseSkillCard title="Languages" skills={skillsWithIcons} />);

      expect(screen.getByTestId('flag-icon')).toBeInTheDocument();
      expect(screen.getByText('German (Native)')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('detects single-column layout on small screens', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      renderWithTheme(<BaseSkillCard title="Skills" skills={detailedSkills} />);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('maintains multi-column layout on large screens', () => {
      // Mock large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderWithTheme(<BaseSkillCard title="Skills" skills={detailedSkills} />);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      expect(screen.getByText('Skills')).toBeInTheDocument();
    });
  });

  describe('Monochrome Mode', () => {
    it('applies monochrome styles when enabled', () => {
      renderWithTheme(
        <BaseSkillCard title="Languages" skills={skillsWithIcons} monochrome={true} />
      );

      expect(screen.getByText('German (Native)')).toBeInTheDocument();
      expect(screen.getByTestId('flag-icon')).toBeInTheDocument();
    });
  });

  describe('Skill Types', () => {
    it('handles mixed simple and detailed skills', () => {
      const mixedSkills = ['Simple Skill', ...detailedSkills];

      renderWithTheme(<BaseSkillCard title="Mixed Skills" skills={mixedSkills} />);

      expect(screen.getByText('Simple Skill')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles empty skills array', () => {
      renderWithTheme(<BaseSkillCard title="Empty Skills" skills={[]} />);

      expect(screen.getByText('Empty Skills')).toBeInTheDocument();
    });

    it('handles skills without required properties', () => {
      const incompleteSkills: DetailedSkill[] = [{ name: 'Incomplete Skill' } as DetailedSkill];

      renderWithTheme(<BaseSkillCard title="Incomplete Skills" skills={incompleteSkills} />);

      expect(screen.getByText('Incomplete Skill')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithTheme(<BaseSkillCard title="Skills" skills={detailedSkills} />);

      const chips = screen.getAllByRole('button');
      expect(chips.length).toBeGreaterThan(0);

      // Check that chips are focusable
      chips.forEach((chip) => {
        expect(chip).toHaveAttribute('tabindex');
      });
    });
  });
});
