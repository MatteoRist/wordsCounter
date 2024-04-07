import React, { useState } from "react";
import FileUpload from "./componets/FileUpload";
import StatusIcon from "./componets/StatuIcon";
import WordsTable from "./componets/WordsTable";
import { lowMatch, stringToWordCountArray } from "./libs/utils";

function App() {
  const [ignoreArray, setIgnoreArray] = useState<string[]>([]);
  const [ignoreUploadSuccess, setIgnoreUploadSuccess] = useState<
    boolean | null
  >(null);
  const [unmatchedWordsCount, setUnmatchedWordsCount] = useState<WordCount[]>(
    []
  );
  const [lowmatchedWordsCount, setLowmatchedWordsCount] = useState<WordCount[]>(
    []
  );
  const [textAreaContent, setTextAreaContent] = useState<string>("");
  const [uploadedText, setUploadedText] = useState<string>("");
  const [newWordsToIgnore, setNewWordsToIgnore] = useState<string[]>([]);

  const handleIgnoreFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const text = reader.result.toString();
        const words = text.split(",");
        setIgnoreArray(words.map((word) => word.trim()));
        setIgnoreUploadSuccess(true);
      }
    };
    reader.onerror = () => {
      setIgnoreUploadSuccess(false);
    };
    reader.readAsText(file);
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextAreaContent(event.target.value);
  };

  const handleTextUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const text = reader.result.toString();
        setUploadedText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleCalculateClick = () => {
    //clear
    setNewWordsToIgnore([]);
    setUnmatchedWordsCount([]);
    setLowmatchedWordsCount([]);

    const wordCountArray = stringToWordCountArray(
      uploadedText ? uploadedText : textAreaContent,
      ignoreArray
    );

    const lowmatchingWords: WordCount[] = [];

    // Filter out words that low match any word in the ignoreArray
    const unmatchedWords = wordCountArray.filter((wordCount) => {
      for (const ignoreWord of ignoreArray) {
        if (lowMatch(wordCount.word, ignoreWord)) {
          lowmatchingWords.push(wordCount);
          return false; // Do not include low matched words
        }
      }
      return true; // Include words that do not low match any word in the ignoreArray
    });

    // Set unmatched words
    setUnmatchedWordsCount(unmatchedWords);

    // Set lowmatched words
    setLowmatchedWordsCount(lowmatchingWords);
  };

  const handleAddWordToIgnore = (word: string, checked: boolean) => {
    if (checked) {
      //add
      if (!newWordsToIgnore.includes(word)) {
        setNewWordsToIgnore([...newWordsToIgnore, word]);
      }
    } else {
      //remove
      setNewWordsToIgnore([...newWordsToIgnore.filter((w) => w !== word)]);
    }
  };

  const handleIgnoreDownload = () => {
    // Merge ignoreArray and newWordsToIgnore and remove duplicates
    const mergedIgnoreArray = Array.from(
      new Set([...ignoreArray, ...newWordsToIgnore])
    );

    // Create a comma-separated string of the merged array values
    const csvContent = mergedIgnoreArray.join(",");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/plain" });

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "ignore_list.txt";

    // Append the anchor element to the document body and trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the anchor element and revoking the object URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5">
      {/* Upper Section */}
      <div className="p-4 flex flex-col md:gap-20 sm:flex-row gap-10">
        {/* Left Side */}
        <div className="flex flex-col">
          <p className="text-2xl mb-5">Upload an ignore file</p>
          <FileUpload onFileUpload={handleIgnoreFileUpload}>
            Upload Ignore
          </FileUpload>
          <StatusIcon success={ignoreUploadSuccess}></StatusIcon>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-grow">
          <p className="text-2xl mb-5">
            Import a text file or paste it down below
          </p>

          <FileUpload onFileUpload={handleTextUpload}>Upload Text</FileUpload>

          {!uploadedText ? (
            <textarea
              className="border rounded p-2 h-72 resize-none mt-5"
              placeholder="Enter text here..."
              onChange={handleTextAreaChange}
              value={textAreaContent}
              disabled={!!uploadedText}
            ></textarea>
          ) : (
            <StatusIcon success={true}></StatusIcon>
          )}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center p-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3 grow ${
            !(textAreaContent || uploadedText) &&
            "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleCalculateClick}
          disabled={!(textAreaContent || uploadedText)}
        >
          Calculate
        </button>
      </div>

      {/* Lower Section */}
      <div className="flex-1 px-4">
        {/* Tables */}
        <div>
          {unmatchedWordsCount.length > 0 && (
            <div>
              <p className="text-2xl mb-4 mt-8">Unmatched Words</p>
              <WordsTable
                wordCounts={unmatchedWordsCount}
                onCheckboxChange={handleAddWordToIgnore}
              ></WordsTable>
            </div>
          )}
          {lowmatchedWordsCount.length > 0 && (
            <div>
              <p className="text-2xl mb-4 mt-8">Lowmatched Words</p>
              <WordsTable
                wordCounts={lowmatchedWordsCount}
                onCheckboxChange={handleAddWordToIgnore}
              ></WordsTable>
            </div>
          )}
        </div>

        {/* Button */}
        {(unmatchedWordsCount.length > 0 ||
          lowmatchedWordsCount.length > 0) && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
            onClick={handleIgnoreDownload}
          >
            Download Ignore
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
