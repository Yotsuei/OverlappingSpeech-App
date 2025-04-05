// components/AudioPreview.tsx
import React from 'react';

interface AudioPreviewProps {
  taskId: string;
  filename: string;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({ taskId, filename }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Audio Preview</h3>
      <audio controls className="w-full">
        <source src={`http://localhost:8000/preview/${filename}`} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};