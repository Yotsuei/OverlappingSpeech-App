// components/UploadForm.tsx
import React, { useState, useCallback } from 'react';
import apiClient from './ApiClient';

interface UploadFormProps {
  type: 'file' | 'url';
  onUploadSuccess: (taskId: string) => void;
  onError: (message: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ type, onUploadSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile.type.match(/audio\/.*|video\/.*/)) {
      onError('Unsupported file type');
      return;
    }
    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const handleUrlChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await uploadUrl(url);
  };

  const uploadFile = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/upload-file', formData);
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      onError('File upload failed');
    }
  }, [onUploadSuccess, onError]);

  const uploadUrl = useCallback(async (url: string) => {
    try {
      const response = await apiClient.post('/upload-url', { url });
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      onError('URL upload failed');
    }
  }, [onUploadSuccess, onError]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mt-4">
      {type === 'file' ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-center">
              <p className="text-gray-600">
                Drag and drop audio file or{' '}
                <span className="text-blue-600 hover:text-blue-500">browse files</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Supports WAV, MP3, MP4</p>
            </div>
          </label>
        </div>
      ) : (
        <form onSubmit={handleUrlChange} className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Google Drive or audio URL"
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Upload URL
          </button>
        </form>
      )}
    </div>
  );
};