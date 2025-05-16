import React from 'react';
import { Box, useTheme } from '@mui/material';

interface LetterInputProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const LetterInput: React.FC<LetterInputProps> = ({ value, isSelected, onClick, disabled }) => {
  const theme = useTheme();

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: '40px',
        height: '40px',
        border: '2px solid',
        borderColor: isSelected 
          ? theme.palette.primary.main 
          : theme.palette.mode === 'dark' 
            ? theme.palette.action.disabled 
            : theme.palette.action.disabled,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: isSelected 
          ? theme.palette.primary.main + '20' 
          : theme.palette.mode === 'dark' 
            ? theme.palette.background.paper
            : theme.palette.background.paper,
        color: disabled 
          ? theme.palette.text.disabled 
          : theme.palette.text.primary,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: disabled 
            ? theme.palette.action.disabled
            : theme.palette.primary.main,
          backgroundColor: disabled 
            ? theme.palette.background.paper
            : (isSelected 
                ? theme.palette.primary.main + '20'
                : theme.palette.mode === 'dark' 
                  ? theme.palette.action.hover
                  : theme.palette.action.hover),
        },
        margin: '2px',
        position: 'relative',
        zIndex: isSelected ? 1 : 0
      }}
    >
      {value}
    </Box>
  );
};

export default LetterInput; 