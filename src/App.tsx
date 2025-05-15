import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Container, Box, ThemeProvider, createTheme } from '@mui/material';
import CreateClue from './components/CreateClue';
import SolveClue from './components/SolveClue';
import Logo from './components/Logo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BA68C8',
      light: '#CE93D8',
      dark: '#9C27B0',
    },
  },
});

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we're at the root or /Cryptic, redirect to create
    if (location.pathname === '/' || location.pathname === '/Cryptic') {
      navigate('/create');
    }
  }, [location.pathname, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={1}
          sx={{ 
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <Logo />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/create" element={<CreateClue />} />
            <Route path="/solve" element={<SolveClue />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 