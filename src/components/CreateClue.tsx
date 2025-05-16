import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { encodeAnswer } from '../utils/encoding';

const CreateClue: React.FC = () => {
  const [clue, setClue] = useState('');
  const [answer, setAnswer] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [enableLetterHints, setEnableLetterHints] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeAnswer(answer);
    
    // Find pipe locations and remove pipes from clue
    const pipeLocations: [number, number][] = [];
    let displayClue = clue;
    
    // First find all pipe positions
    let pipePositions: number[] = [];
    for (let i = 0; i < clue.length; i++) {
      if (clue[i] === '|') {
        pipePositions.push(i);
      }
    }

    // If we have exactly 2 pipes, store their positions as a pair
    if (pipePositions.length === 2) {
      pipeLocations.push([pipePositions[0], pipePositions[1]]);
    }

    // Find indicator locations (text between angle brackets)
    const indicatorLocations: [number, number][] = [];
    let inIndicator = false;
    let startIndex = 0;

    // First find all indicator positions
    for (let i = 0; i < clue.length; i++) {
      if (clue[i] === '<') {
        inIndicator = true;
        startIndex = i;
      } else if (clue[i] === '>' && inIndicator) {
        inIndicator = false;
        indicatorLocations.push([startIndex, i]);
      }
    }

    // Remove all symbols from display clue
    displayClue = displayClue.replace(/[|<>]/g, '');

    // Calculate how many symbols were removed before each position
    const getOffset = (pos: number): number => {
      let offset = 0;
      for (let i = 0; i < pos; i++) {
        if (clue[i] === '|' || clue[i] === '<' || clue[i] === '>') {
          offset++;
        }
      }
      return offset;
    };

    // Adjust pipe locations to account for removed symbols
    const adjustedPipeLocations = pipeLocations.map(([start, end]) => {
      return [start - getOffset(start), end - getOffset(end)];
    });

    // Adjust indicator locations to account for removed symbols
    const adjustedIndicatorLocations = indicatorLocations.map(([start, end]) => {
      return [start - getOffset(start), end - getOffset(end)];
    });

    // Encode clue for URL safety, but not obfuscation
    const clueParam = encodeURIComponent(displayClue);
    const url = `${window.location.origin}/Cryptic/solve?clue=${clueParam}&a=${encoded}${adjustedPipeLocations.length > 0 ? `&p=${encodeAnswer(adjustedPipeLocations.flat().join(','))}` : ''}${adjustedIndicatorLocations.length > 0 ? `&i=${encodeAnswer(adjustedIndicatorLocations.flat().join(','))}` : ''}${enableLetterHints ? '&h=1' : ''}`;
    setShareUrl(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        mt: { xs: 2, sm: 4 }, 
        p: { xs: 1, sm: 2 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 600,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            letterSpacing: '0.02em',
            background: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
            textTransform: 'none',
            textAlign: 'center'
          }}
        >
          Create a Cryptic Clue
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Clue"
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            margin="normal"
            required
            multiline
            rows={3}
            helperText="Use || to mark the definition part of the clue, and <> to mark indicator phrases"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={enableLetterHints}
                onChange={(e) => setEnableLetterHints(e.target.checked)}
                color="primary"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 28,
                  },
                  '&.Mui-checked': {
                    color: 'primary.main',
                  }
                }}
              />
            }
            label={
              <Typography sx={{ 
                color: 'text.secondary',
                fontSize: '0.95rem'
              }}>
                Enable letter hints
              </Typography>
            }
            sx={{ 
              mt: 1,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.95rem'
              }
            }}
          />
          <Box sx={{ mt: 2, mb: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(186, 104, 200, 0.3)'
                }
              }}
            >
              Generate Share Link
            </Button>
          </Box>
        </form>

        {shareUrl && (
          <Box 
            sx={{ 
              mt: 3,
              p: 3,
              borderRadius: 2,
              background: 'rgba(186, 104, 200, 0.05)',
              border: '1px solid rgba(186, 104, 200, 0.1)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: '1.1rem',
                color: 'text.secondary',
                mb: 2
              }}
            >
              Share this link with your friends:
            </Typography>
            <TextField
              fullWidth
              value={shareUrl}
              InputProps={{
                readOnly: true,
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={handleCopy}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Copy Link
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CreateClue; 