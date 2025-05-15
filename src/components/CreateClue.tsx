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
    const pipeLocations: number[] = [];
    let displayClue = clue;
    
    // First find all pipe positions
    let pipePositions: number[] = [];
    for (let i = 0; i < clue.length; i++) {
      if (clue[i] === '|') {
        pipePositions.push(i);
      }
    }

    // If we have exactly 2 pipes, store their positions
    if (pipePositions.length === 2) {
      pipeLocations.push(pipePositions[0], pipePositions[1]);
      // Remove the pipes from the display clue
      displayClue = displayClue.replace(/\|/g, '');
    }

    // Encode clue for URL safety, but not obfuscation
    const clueParam = encodeURIComponent(displayClue);
    const url = `${window.location.origin}/solve?clue=${clueParam}&a=${encoded}${pipeLocations.length === 2 ? `&p=${encodeAnswer(pipeLocations.join(','))}` : ''}${enableLetterHints ? '&h=1' : ''}`;
    setShareUrl(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 600,
            fontSize: '2.5rem',
            letterSpacing: '0.02em',
            background: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            textTransform: 'none'
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
            helperText="Use || to mark the definition part of the clue"
          />
          <TextField
            fullWidth
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={enableLetterHints}
                onChange={(e) => setEnableLetterHints(e.target.checked)}
                color="primary"
              />
            }
            label="Enable letter hints"
            sx={{ mt: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Generate Share Link
          </Button>
        </form>
        {shareUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Share this link with your friends:
            </Typography>
            <TextField
              fullWidth
              value={shareUrl}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleCopy}
              fullWidth
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