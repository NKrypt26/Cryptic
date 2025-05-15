import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            lineHeight: 1,
            transform: 'rotate(-10deg)',
          }}
        >
          C
        </Typography>
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Cryptic
      </Typography>
    </Box>
  );
};

export default Logo; 