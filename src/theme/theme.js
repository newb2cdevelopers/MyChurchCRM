import '@fontsource/geist-sans';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e39e0',
      light: '#7757fa',
      dark: '#4816cb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5d5e64',
      light: '#e2e2e9',
      dark: '#45464c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ba1a1a',
      light: '#ffdad6',
      dark: '#93000a',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4ADE80',
      light: '#DCFCE7',
      dark: '#166534',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FBBF24',
      light: '#FEF3C7',
      dark: '#92400E',
      contrastText: '#ffffff',
    },
    info: {
      main: '#A78BFA',
      light: '#EDE9FE',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#faf8ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#131b2e',
      secondary: '#484555',
    },
    divider: '#c9c4d8',
    tertiary: {
      main: '#4d5d73',
      light: '#66768d',
      dark: '#38485d',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Geist Sans", Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '40px',
      fontWeight: 600,
      lineHeight: '48px',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: '40px',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: '28px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    caption: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    subtitle2: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.01em',
    },
    overline: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 0px 12px rgba(0, 0, 0, 0.04)',
    '0px 0px 24px rgba(0, 0, 0, 0.08)',
    '0px 4px 8px rgba(0, 0, 0, 0.04)',
    '0px 6px 12px rgba(0, 0, 0, 0.06)',
    '0px 8px 16px rgba(0, 0, 0, 0.06)',
    '0px 10px 20px rgba(0, 0, 0, 0.06)',
    '0px 12px 24px rgba(0, 0, 0, 0.06)',
    '0px 14px 28px rgba(0, 0, 0, 0.08)',
    '0px 16px 32px rgba(0, 0, 0, 0.08)',
    '0px 18px 36px rgba(0, 0, 0, 0.08)',
    '0px 20px 40px rgba(0, 0, 0, 0.08)',
    '0px 22px 44px rgba(0, 0, 0, 0.10)',
    '0px 24px 48px rgba(0, 0, 0, 0.10)',
    '0px 26px 52px rgba(0, 0, 0, 0.10)',
    '0px 28px 56px rgba(0, 0, 0, 0.12)',
    '0px 30px 60px rgba(0, 0, 0, 0.12)',
    '0px 32px 64px rgba(0, 0, 0, 0.12)',
    '0px 34px 68px rgba(0, 0, 0, 0.14)',
    '0px 36px 72px rgba(0, 0, 0, 0.14)',
    '0px 38px 76px rgba(0, 0, 0, 0.14)',
    '0px 40px 80px rgba(0, 0, 0, 0.16)',
    '0px 42px 84px rgba(0, 0, 0, 0.16)',
    '0px 44px 88px rgba(0, 0, 0, 0.16)',
    '0px 46px 92px rgba(0, 0, 0, 0.18)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 0px 12px rgba(94, 57, 224, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#c9c4d8',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#5e39e0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5e39e0',
              borderWidth: 2,
              boxShadow: '0 0 0 3px rgba(94, 57, 224, 0.1)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f1f1',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(19, 27, 46, 0.4)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#faf8ff',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#faf8ff',
          fontFamily: '"Geist Sans", Arial, Helvetica, sans-serif',
          margin: 0,
        },
      },
    },
  },
});

export default theme;
