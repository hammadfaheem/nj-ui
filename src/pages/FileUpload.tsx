import React from "react";
import { Upload, FileText, Trash2 } from "lucide-react";

interface FileUploadProps {
  uploadedFiles: any[];
  onUpload: (files: any[]) => void;
  onRemove: (index: number) => void;
  formatFileSize: (bytes: number) => string;
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadedFiles, onUpload, onRemove, formatFileSize }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      filename: file.name,
      file_path: `upload/files/${file.name}`,
      file_size: file.size,
      mime_type: file.type || "application/pdf",
      upload_date: new Date().toISOString(),
      file: file,
    }));
    onUpload(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Knowledge Base Files
      </label>
      <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                Upload files or drag and drop
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, TXT up to 10MB each
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </div>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files:
          </h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;