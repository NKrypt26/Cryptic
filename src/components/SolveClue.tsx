import React, { useState, useEffect, ReactElement } from 'react';
import { Button, Box, Typography, Paper, Alert, Fade } from '@mui/material';
import { decodeAnswer } from '../utils/encoding';
import { useSearchParams } from 'react-router-dom';
import LetterInput from './LetterInput';

const SolveClue: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [clue, setClue] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [wordLengths, setWordLengths] = useState<number[]>([]);
  const [pipeLocations, setPipeLocations] = useState<[number, number][]>([]);
  const [indicatorLocations, setIndicatorLocations] = useState<[number, number][]>([]);
  const [showDefinition, setShowDefinition] = useState(false);
  const [revealedIndicators, setRevealedIndicators] = useState<Set<number>>(new Set());
  const [enableLetterHints, setEnableLetterHints] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    try {
      const clueParam = searchParams.get('clue') || '';
      const encodedAnswer = searchParams.get('a') || '';
      const pipeParam = searchParams.get('p');
      const indicatorParam = searchParams.get('i');
      const hintParam = searchParams.get('h');

      // Decode the clue parameter to handle spaces and special characters
      const decodedClue = decodeURIComponent(clueParam);
      setClue(decodedClue);
      setEnableLetterHints(hintParam === '1');
      
      if (pipeParam) {
        // Decode pipe locations and convert to pairs
        const decodedPipeParam = decodeAnswer(pipeParam);
        const locations = decodedPipeParam.split(',').map(Number);
        const pipePairs: [number, number][] = [];
        for (let i = 0; i < locations.length; i += 2) {
          pipePairs.push([locations[i], locations[i + 1]]);
        }
        setPipeLocations(pipePairs);
      }

      if (indicatorParam) {
        // Decode indicator locations and convert to pairs
        const decodedIndicatorParam = decodeAnswer(indicatorParam);
        const locations = decodedIndicatorParam.split(',').map(Number);
        const indicatorPairs: [number, number][] = [];
        for (let i = 0; i < locations.length; i += 2) {
          indicatorPairs.push([locations[i], locations[i + 1]]);
        }
        setIndicatorLocations(indicatorPairs);
      }

      if (encodedAnswer) {
        const decodedAnswer = decodeAnswer(encodedAnswer);
        setAnswer(decodedAnswer);
        setUserAnswer(Array(decodedAnswer.length).fill(''));
        setWordLengths(decodedAnswer.split(' ').map(word => word.length));
      }
    } catch (err) {
      setError('Invalid clue format');
    }
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission default behavior
        // Reconstruct the answer with spaces between words
        const reconstructedAnswer = wordLengths.reduce((acc, length, index) => {
          const start = acc.length;
          const word = userAnswer.slice(start, start + length).join('');
          return index === 0 ? word : `${acc} ${word}`;
        }, '');
        setIsCorrect(reconstructedAnswer.toLowerCase() === answer.toLowerCase());
      } else if (e.key === 'Backspace') {
        if (userAnswer[selectedIndex] && !revealedLetters.has(selectedIndex)) {
          // If current box has content and is not revealed, clear it and stay in place
          const newAnswer = [...userAnswer];
          newAnswer[selectedIndex] = '';
          setUserAnswer(newAnswer);
        } else if (selectedIndex > 0) {
          // If current box is empty or revealed, find the previous unrevealed letter
          let prevIndex = selectedIndex - 1;
          while (prevIndex >= 0 && revealedLetters.has(prevIndex)) {
            prevIndex--;
          }
          if (prevIndex >= 0) {
            // Clear previous letter and move back
            const newAnswer = [...userAnswer];
            newAnswer[prevIndex] = '';
            setUserAnswer(newAnswer);
            setSelectedIndex(prevIndex);
          }
        }
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        // Find the previous unrevealed letter
        let prevIndex = selectedIndex - 1;
        while (prevIndex >= 0 && revealedLetters.has(prevIndex)) {
          prevIndex--;
        }
        if (prevIndex >= 0) {
          setSelectedIndex(prevIndex);
        }
      } else if (e.key === 'ArrowRight' && selectedIndex < userAnswer.length - 1) {
        // Find the next unrevealed letter
        let nextIndex = selectedIndex + 1;
        while (nextIndex < userAnswer.length && revealedLetters.has(nextIndex)) {
          nextIndex++;
        }
        if (nextIndex < userAnswer.length) {
          setSelectedIndex(nextIndex);
        }
      } else if (/^[a-zA-Z]$/.test(e.key) && !revealedLetters.has(selectedIndex)) {
        // Handle letter input only if the current box is not revealed
        const newAnswer = [...userAnswer];
        newAnswer[selectedIndex] = e.key.toUpperCase();
        setUserAnswer(newAnswer);
        
        // Move to next unrevealed box if not at the end
        if (selectedIndex < userAnswer.length - 1) {
          let nextIndex = selectedIndex + 1;
          while (nextIndex < userAnswer.length && revealedLetters.has(nextIndex)) {
            nextIndex++;
          }
          if (nextIndex < userAnswer.length) {
            setSelectedIndex(nextIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, userAnswer, revealedLetters, answer, wordLengths]);

  const getLetterCounts = (answer: string): string => {
    const words = answer.split(' ');
    return `(${words.map(word => word.length).join(', ')})`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reconstruct the answer with spaces between words
    const reconstructedAnswer = wordLengths.reduce((acc, length, index) => {
      const start = acc.length;
      const word = userAnswer.slice(start, start + length).join('');
      return index === 0 ? word : `${acc} ${word}`;
    }, '');
    setIsCorrect(reconstructedAnswer.toLowerCase() === answer.toLowerCase());
  };

  const handleDefinitionHint = () => {
    setShowDefinition(true);
    setHintsUsed(prev => prev + 1);
  };

  const handleIndicatorHint = () => {
    // Find all unrevealed indicators
    const unrevealedIndicators = indicatorLocations
      .map((_, index) => index)
      .filter(index => !revealedIndicators.has(index));

    if (unrevealedIndicators.length === 0) return;

    // Pick a random unrevealed indicator
    const randomIndex = Math.floor(Math.random() * unrevealedIndicators.length);
    const indicatorIndex = unrevealedIndicators[randomIndex];
    
    // Add to revealed indicators
    setRevealedIndicators(new Set([...Array.from(revealedIndicators), indicatorIndex]));
    setHintsUsed(prev => prev + 1);
  };

  const handleLetterHint = () => {
    if (!enableLetterHints) return;

    // Find all unrevealed letters (including those filled by user)
    const unrevealedIndices = userAnswer
      .map((_, index) => index)
      .filter(index => !revealedLetters.has(index));

    if (unrevealedIndices.length === 0) return;

    // Pick a random unrevealed letter
    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    
    // Reveal the letter (this will overwrite any user input)
    const newAnswer = [...userAnswer];
    newAnswer[randomIndex] = answer[randomIndex].toUpperCase();
    setUserAnswer(newAnswer);
    
    // Add to revealed letters
    setRevealedLetters(new Set([...Array.from(revealedLetters), randomIndex]));
    setHintsUsed(prev => prev + 1);
  };

  const renderLetterBoxes = () => {
    const boxes: React.ReactElement[] = [];
    let currentIndex = 0;

    wordLengths.forEach((length, wordIndex) => {
      // Add letter boxes for this word
      for (let i = 0; i < length; i++) {
        const index = currentIndex;
        boxes.push(
          <LetterInput
            key={index}
            value={userAnswer[index]}
            isSelected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
            disabled={revealedLetters.has(index)}
          />
        );
        currentIndex++;
      }

      // Add space between words (except after the last word)
      if (wordIndex < wordLengths.length - 1) {
        boxes.push(
          <Box key={`space-${wordIndex}`} sx={{ width: '20px' }} />
        );
      }
    });

    return boxes;
  };

  const renderClueWithHighlights = () => {
    const parts: ReactElement[] = [];
    let currentIndex = 0;

    // Helper function to add text with highlighting
    const addHighlightedText = (text: string, isDefinition: boolean, isIndicator: boolean) => {
      if (text) {
        parts.push(
          <span
            key={currentIndex}
            style={{
              backgroundColor: isDefinition 
                ? 'rgba(186, 104, 200, 0.15)' // Purple for definition
                : isIndicator 
                  ? 'rgba(33, 150, 243, 0.15)' // Blue for indicator
                  : 'transparent',
              padding: (isDefinition || isIndicator) ? '2px 6px' : '0',
              borderRadius: (isDefinition || isIndicator) ? '4px' : '0',
              margin: '0',
              transition: 'background-color 0.2s ease',
              display: 'inline'
            }}
          >
            {text}
          </span>
        );
        currentIndex += text.length;
      }
    };

    // Process the clue with both definition and indicator highlights
    let remainingClue = clue;
    let lastIndex = 0;

    // Sort all highlight positions
    const highlightPositions = [
      ...(showDefinition && pipeLocations.length > 0 
        ? [{ type: 'definition', start: pipeLocations[0][0], end: pipeLocations[0][1] }] 
        : []),
      ...Array.from(revealedIndicators).map(index => ({
        type: 'indicator',
        start: indicatorLocations[index][0],
        end: indicatorLocations[index][1] - 1 // Subtract 1 to not include the trailing space
      }))
    ].sort((a, b) => a.start - b.start);

    // Process each highlight position
    highlightPositions.forEach(({ type, start, end }) => {
      // Add text before the highlight
      if (start > lastIndex) {
        addHighlightedText(remainingClue.slice(lastIndex, start), false, false);
      }
      // Add the highlighted text
      addHighlightedText(
        remainingClue.slice(start, end + 1),
        type === 'definition',
        type === 'indicator'
      );
      lastIndex = end + 1;
    });

    // Add any remaining text
    if (lastIndex < remainingClue.length) {
      addHighlightedText(remainingClue.slice(lastIndex), false, false);
    }

    return (
      <span style={{ whiteSpace: 'pre-wrap', display: 'inline' }}>
        {parts}
      </span>
    );
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
          Solve the Cryptic Clue
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            lineHeight: 1.6,
            color: 'text.secondary',
            textAlign: 'center',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            whiteSpace: 'pre-wrap'
          }}
        >
          {renderClueWithHighlights()}
          {answer && (
            <Typography 
              component="span" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.8,
                fontSize: '0.9em',
                whiteSpace: 'nowrap'
              }}
            >
              {getLetterCounts(answer)}
            </Typography>
          )}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              gap: 0,
              mb: 4,
              cursor: 'text',
              position: 'relative',
              minHeight: '60px'
            }}
            onClick={() => {
              const hiddenInput = document.getElementById('hidden-input');
              if (hiddenInput instanceof HTMLElement) {
                hiddenInput.focus();
              }
            }}
            tabIndex={0}
          >
            {renderLetterBoxes()}
            <input
              id="hidden-input"
              type="text"
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                width: 0,
                height: 0,
                padding: 0,
                border: 'none',
                outline: 'none',
              }}
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2, 
              mb: 3
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.95rem',
                textAlign: 'center'
              }}
            >
              Hints
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Button
                variant="outlined"
                onClick={handleDefinitionHint}
                disabled={pipeLocations.length === 0 || showDefinition}
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
                Definition
              </Button>
              <Button
                variant="outlined"
                onClick={handleIndicatorHint}
                disabled={indicatorLocations.length === 0 || 
                  Array.from(revealedIndicators).length >= indicatorLocations.length}
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
                Indicator
              </Button>
              <Button
                variant="outlined"
                onClick={handleLetterHint}
                disabled={!enableLetterHints || revealedLetters.size >= answer.length}
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
                Letter
              </Button>
            </Box>
          </Box>

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
            Check Answer
          </Button>
        </form>

        <Fade in={isCorrect !== null}>
          <Box sx={{ mt: 3 }}>
            {isCorrect !== null && (
              <Alert 
                severity={isCorrect ? "success" : "error"} 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontSize: '1rem'
                  }
                }}
              >
                {isCorrect 
                  ? `Correct! Well done! (${hintsUsed} hint${hintsUsed !== 1 ? 's' : ''} used)` 
                  : "Not quite right. Try again!"}
              </Alert>
            )}
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default SolveClue; 