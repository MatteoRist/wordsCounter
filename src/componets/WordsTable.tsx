import React, { useState } from "react";

interface WordsTableProps {
  wordCounts: WordCount[];
  onCheckboxChange: (word: string, checked: boolean) => void;
}

const WordsTable: React.FC<WordsTableProps> = ({
  wordCounts,
  onCheckboxChange,
}) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const sortedWordCounts = [...wordCounts].sort((a, b) => {
    // Sort by count in descending order
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    // If counts are the same, sort by word length in descending order
    return b.word.length - a.word.length;
  });

  const handleCheckboxChange = (word: string, checked: boolean) => {
    const updatedSelectedWords = checked
      ? [...selectedWords, word]
      : selectedWords.filter((selectedWord) => selectedWord !== word);
    setSelectedWords(updatedSelectedWords);
    onCheckboxChange(word, checked);
  };

  return (
    <table className="table-auto border-collapse w-full">
      <thead>
        <tr>
          <th className="border px-4 py-2">Count</th>
          <th className="border px-4 py-2">Word</th>
          <th className="border px-4 py-2">Ignore</th>
        </tr>
      </thead>
      <tbody>
        {sortedWordCounts.map((wordCount, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{wordCount.count}</td>
            <td className="border px-4 py-2">{wordCount.word}</td>
            <td
              className="border px-4 py-2"
              onClick={() =>
                handleCheckboxChange(
                  wordCount.word,
                  !selectedWords.includes(wordCount.word)
                )
              }
            >
              <input
                type="checkbox"
                checked={selectedWords.includes(wordCount.word)}
                onChange={(e) =>
                  handleCheckboxChange(wordCount.word, e.target.checked)
                }
                className="h-4 w-4" // Adjust the height and width as needed
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordsTable;
