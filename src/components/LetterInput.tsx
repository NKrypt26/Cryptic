import React from 'react';
import { Box } from '@mui/material';

interface LetterInputProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const LetterInput: React.FC<LetterInputProps> = ({
  value,
  isSelected,
  onClick,
  disabled = false
}) => {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: '40px',
        height: '40px',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'grey.300',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 600,
        backgroundColor: isSelected ? 'primary.light' : (disabled ? 'grey.100' : 'white'),
        color: disabled ? 'grey.500' : 'text.primary',
        cursor: disabled ? 'default' : 'text',
        '&:hover': {
          borderColor: disabled ? 'grey.300' : 'primary.main',
          backgroundColor: disabled ? 'grey.100' : (isSelected ? 'primary.light' : 'grey.50'),
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {value}
    </Box>
  );
};

export default LetterInput; 