"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onFileChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

const FileUpload = ({
  onFileChange,
  maxFiles = 1,
  accept = { "image/*": [".jpeg", ".png", ".gif"] },
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + files.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles((prev) => [...prev, ...newFiles]);
      onFileChange?.([...files, ...newFiles]);
      toast.success(`${acceptedFiles.length} file(s) added.`);
    },
    [files, maxFiles, onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    onFileChange?.(files.filter((file) => file.name !== fileName));
    toast.info(`File '${fileName}' removed.`);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
        {isDragActive ? (
          <p className="text-gray-600 dark:text-gray-300">Drop the files here ...</p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Drag 'n' drop some files here, or click to select files (Max {maxFiles})
          </p>
        )}
        <em className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          (e.g., .jpeg, .png, .gif)
        </em>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Uploaded Files:
          </h4>
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-700 shadow-sm"
              >
                <div className="flex items-center">
                  {file.type.startsWith("image/") && (
                    <img
                      src={(file as any).preview}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded-md mr-3"
                      onLoad={() => {
                        URL.revokeObjectURL((file as any).preview);
                      }}
                    />
                  )}
                  <span className="text-gray-700 dark:text-gray-200 text-sm">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;