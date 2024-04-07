import React, { useState } from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<React.PropsWithChildren<FileUploadProps>> = ({
  onFileUpload,
  children,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  return (
    <div>
      <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        {children}
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="text/plain"
        />
      </label>
      {selectedFile && (
        <p className="m-2">Selected file: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default FileUpload;
