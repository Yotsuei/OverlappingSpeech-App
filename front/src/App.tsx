// App.tsx
import React, { useState } from 'react';
import { Tab } from './components/Tabs';
import { UploadForm } from './components/UploadForm';
import { ProgressIndicator } from './components/ProgressIndicator';
import { TranscriptionResult } from './components/TranscriptionResult';
import { AudioPreview } from './components/AudioPreview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [filename, setFilename] = useState<string | null>(null);

  const handleUploadSuccess = (taskId: string, filename?: string) => {
    setTaskId(taskId);
    setUploadStatus('processing');
    if (filename) setFilename(filename);
  };

  const handleProcessingComplete = () => {
    setUploadStatus('complete');
  };

  const handleClear = async () => {
    if (taskId) {
      await apiClient.delete(`/cleanup/${taskId}`);
    }
    setTaskId(null);
    setUploadStatus('idle');
    setFilename(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Audio Transcription Service</h1>
        
        <div className="border-b border-gray-200">
          <div className="flex">
            <Tab
              active={activeTab === 'file'}
              onClick={() => setActiveTab('file')}
              label="File Upload"
            />
            <Tab
              active={activeTab === 'url'}
              onClick={() => setActiveTab('url')}
              label="URL Upload"
            />
          </div>
        </div>

        {uploadStatus === 'idle' && (
          <UploadForm
            type={activeTab}
            onUploadSuccess={handleUploadSuccess}
            onError={(message) => alert(message)}
          />
        )}

        {filename && <AudioPreview taskId={taskId!} filename={filename} />}

        {uploadStatus === 'processing' && taskId && (
          <ProgressIndicator
            taskId={taskId}
            onComplete={handleProcessingComplete}
          />
        )}

        {uploadStatus === 'complete' && taskId && (
          <TranscriptionResult taskId={taskId} onClear={handleClear} />
        )}
      </div>
    </div>
  );
};

export default App;