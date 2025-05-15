import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  useEffect(() => {
    document.title = 'Cryptic';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
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
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Logo />
              </Link>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<CreateClue />} />
              <Route path="/solve" element={<SolveClue />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 