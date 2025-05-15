import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Alert } from '@mui/material';
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
  const [pipeLocations, setPipeLocations] = useState<number[]>([]);
  const [showDefinition, setShowDefinition] = useState(false);
  const [enableLetterHints, setEnableLetterHints] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    try {
      const clueParam = searchParams.get('clue') || '';
      const encodedAnswer = searchParams.get('a') || '';
      const pipeParam = searchParams.get('p');
      const hintParam = searchParams.get('h');

      setClue(clueParam);
      setEnableLetterHints(hintParam === '1');
      
      if (pipeParam) {
        // Decode and adjust pipe locations
        const decodedPipeParam = decodeAnswer(pipeParam);
        const locations = decodedPipeParam.split(',').map(Number);
        setPipeLocations(locations);
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
        if (selectedIndex > 0) {
          // Find the previous unrevealed letter
          let prevIndex = selectedIndex - 1;
          while (prevIndex >= 0 && revealedLetters.has(prevIndex)) {
            prevIndex--;
          }
          if (prevIndex >= 0) {
            // Clear current letter and move back
            const newAnswer = [...userAnswer];
            newAnswer[selectedIndex] = '';
            setUserAnswer(newAnswer);
            setSelectedIndex(prevIndex);
          } else if (userAnswer[selectedIndex]) {
            // If at the start, just clear the current letter
            const newAnswer = [...userAnswer];
            newAnswer[selectedIndex] = '';
            setUserAnswer(newAnswer);
          }
        } else if (userAnswer[selectedIndex]) {
          // If at the start, just clear the current letter
          const newAnswer = [...userAnswer];
          newAnswer[selectedIndex] = '';
          setUserAnswer(newAnswer);
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
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        // Handle letter input
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

  const handleLetterHint = () => {
    if (!enableLetterHints) return;

    // Find all unrevealed letters
    const unrevealedIndices = userAnswer
      .map((letter, index) => ({ letter, index }))
      .filter(({ letter, index }) => !letter && !revealedLetters.has(index))
      .map(({ index }) => index);

    if (unrevealedIndices.length === 0) return;

    // Pick a random unrevealed letter
    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    
    // Reveal the letter
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

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
          Solve the Cryptic Clue
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {showDefinition && pipeLocations.length === 2 ? (
            <>
              {clue.slice(0, pipeLocations[0])}
              <span
                style={{
                  backgroundColor: 'rgba(186, 104, 200, 0.2)',
                  padding: '0 4px',
                  borderRadius: '4px',
                }}
              >
                {clue.slice(pipeLocations[0], pipeLocations[1] + 1)}
              </span>
              {clue.slice(pipeLocations[1] + 1)}
            </>
          ) : (
            clue
          )}
          {answer && <span style={{ color: '#666' }}> {getLetterCounts(answer)}</span>}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              gap: 0,
              mb: 3,
              cursor: 'text',
            }}
            onClick={() => {
              // Focus the container to enable keyboard input
              const container = document.activeElement;
              if (container instanceof HTMLElement) {
                container.focus();
              }
            }}
            tabIndex={0}
          >
            {renderLetterBoxes()}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDefinitionHint}
              disabled={pipeLocations.length !== 2 || showDefinition}
              fullWidth
            >
              Hint: Definition
            </Button>
            <Button
              variant="outlined"
              onClick={handleLetterHint}
              disabled={!enableLetterHints}
              fullWidth
            >
              Hint: Free Letter
            </Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Check Answer
          </Button>
        </form>
        {isCorrect !== null && (
          <Alert severity={isCorrect ? "success" : "error"} sx={{ mt: 2 }}>
            {isCorrect ? `Correct! Well done! (${hintsUsed} hint${hintsUsed !== 1 ? 's' : ''} used)` : "Not quite right. Try again!"}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default SolveClue; 