import config from "../config";

export function stringToWordCountArray(
  inputString: string,
  ignore?: string[]
): WordCount[] {
  // Initialize params
  if (ignore === undefined) {
    ignore = [];
  }

  // Trim the input string to remove leading and trailing spaces
  const trimmedString = inputString.trim();

  // Remove punctuation and convert to lowercase
  const cleanedString = trimmedString
    .replace(/[^\p{L}\s]|_/gu, " ")
    .toLowerCase();

  // Remove double spaces by replacing them with a single space
  const stringWithoutDoubleSpaces = cleanedString.replace(/\s+/g, " ");

  // Split the string by space to get an array of words
  const wordsArray = stringWithoutDoubleSpaces.split(" ");

  // Filter out too short words and characters and words containing only numbers
  const filteredWordsArray = wordsArray.filter(
    (word) => word.length >= config.minWordLength && !/^\d+$/.test(word)
  );

  // Count the occurrence of each word
  const wordCounts: { [word: string]: number } = {};
  filteredWordsArray.forEach((word) => {
    if (!ignore?.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  // Convert the word counts into an array of WordCount objects
  const wordCountArray: WordCount[] = [];
  for (const word in wordCounts) {
    wordCountArray.push({ word, count: wordCounts[word] });
  }

  return wordCountArray;
}

// Function to check if two words low match
export const lowMatch = (word1: string, word2: string) => {
  const gap = Math.abs(word1.length - word2.length);
  if (gap > 2) return false;

  const minLength = Math.min(word1.length, word2.length);

  for (let i = 0; i < minLength; i++) {
    if (word1[i] !== word2[i]) {
      return i >= minLength - 3; // Return true if the mismatch occurred after the last 3 characters
    }
  }

  return false; // Return false if all characters match
};
