import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BA68C8',
      light: '#CE93D8',
      dark: '#9C27B0',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
        '#root': {
          backgroundColor: '#121212',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
        html: {
          backgroundColor: '#121212',
          margin: 0,
          padding: 0,
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9C27B0',
      light: '#BA68C8',
      dark: '#7B1FA2',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
        '#root': {
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
        html: {
          backgroundColor: '#F5F5F5',
          margin: 0,
          padding: 0,
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export { darkTheme, lightTheme }; 