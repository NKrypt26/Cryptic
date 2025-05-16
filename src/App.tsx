import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import CreateClue from './components/CreateClue';
import SolveClue from './components/SolveClue';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <IconButton 
          onClick={toggleTheme} 
          color="inherit"
          sx={{
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Routes>
        <Route path="/" element={<CreateClue />} />
        <Route path="/create" element={<CreateClue />} />
        <Route path="/solve" element={<SolveClue />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 