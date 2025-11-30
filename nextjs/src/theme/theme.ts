'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }

  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#89665d', // Accent brown
      dark: '#6b4e47',
      light: '#a07569',
    },
    background: {
      default: '#343A40', // Dark background
      paper: '#3d4349',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.9)',
    },
  },
  typography: {
    fontFamily: '"Quicksand", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontWeight: 900,
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '0.8rem 1.5rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#89665d',
        },
      },
    },
  },
});

export default theme;
