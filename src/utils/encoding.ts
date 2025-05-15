// Only encode the answer, keep the clue readable
export const encodeAnswer = (answer: string): string => {
  // Simple character shift for basic obfuscation
  const shifted = answer.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + 1)
  ).join('');
  return btoa(shifted);
};

export const decodeAnswer = (encoded: string): string => {
  try {
    const shifted = atob(encoded);
    return shifted.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 1)
    ).join('');
  } catch (error) {
    throw new Error('Invalid answer format');
  }
}; 