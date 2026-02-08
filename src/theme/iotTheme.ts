import { createTheme } from '@mui/material/styles';

export const iotTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      light: '#5ddefb',
      dark: '#00a3cc',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff8e8e',
      dark: '#cc5555',
    },
    background: {
      default: '#0a0e27',
      paper: '#151b3d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b8d1',
    },
    error: {
      main: '#ff4757',
      light: '#ff6b7a',
      dark: '#cc3845',
    },
    warning: {
      main: '#ffa502',
      light: '#ffb733',
      dark: '#cc8401',
    },
    success: {
      main: '#2ed573',
      light: '#5ddf96',
      dark: '#25aa5c',
    },
    info: {
      main: '#3742fa',
      light: '#5f68fb',
      dark: '#2c35c8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid rgba(0, 212, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
  },
});

