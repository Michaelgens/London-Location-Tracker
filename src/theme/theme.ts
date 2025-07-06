import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2962ff', // Modern blue
      light: '#768fff',
      dark: '#0039cb',
    },
    secondary: {
      main: '#ff3d00', // Vibrant orange-red
      light: '#ff7539',
      dark: '#c30000',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1a237e' : '#ffffff',
      secondary: mode === 'light' ? '#455a64' : '#b0bec5',
    },
    error: {
      main: '#ff3d00',
    },
    success: {
      main: '#00c853',
    },
    warning: {
      main: '#ffd600',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(0,0,0,0.05)' 
            : '0 4px 12px rgba(0,0,0,0.25)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 6px 16px rgba(0,0,0,0.1)'
              : '0 6px 16px rgba(0,0,0,0.3)',
          },
          transition: 'all 0.3s ease',
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 65,
          backgroundColor: mode === 'light' 
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(30,30,30,0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.875rem',
              fontWeight: 600,
            },
          },
        },
        label: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 27,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(19px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: mode === 'dark' ? '#8796A5' : '#aab4be',
            },
          },
        },
        thumb: {
          width: 25,
          height: 25,
        },
        track: {
          borderRadius: 13.5,
          border: '1px solid #bdbdbd',
          backgroundColor: mode === 'dark' ? '#39393D' : '#E9E9EA',
          opacity: 1,
          transition: 'background-color 0.3s ease',
        },
      },
    },
  },
}); 