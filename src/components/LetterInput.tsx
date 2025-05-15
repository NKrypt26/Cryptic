import React from 'react';
import { Box } from '@mui/material';

interface LetterInputProps {
  value: string;
  isSelected: boolean;
  index: number;
  onClick: () => void;
  disabled?: boolean;
}

const LetterInput: React.FC<LetterInputProps> = ({ 
  value, 
  isSelected,
  index,
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
        borderColor: isSelected ? 'primary.main' : 'grey.400',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        backgroundColor: isSelected ? 'primary.light' : 'white',
        color: 'text.primary',
        margin: 0,
        userSelect: 'none',
        cursor: disabled ? 'default' : 'text',
        opacity: disabled ? 0.7 : 1,
        '&:hover': {
          borderColor: disabled ? 'grey.400' : (isSelected ? 'primary.main' : 'primary.light'),
        },
      }}
    >
      {value}
    </Box>
  );
};

export default LetterInput; 