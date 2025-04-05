// components/ProgressIndicator.tsx
import React, { useEffect, useState } from 'react';

interface ProgressIndicatorProps {
  taskId: string;
  onComplete: () => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ taskId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting...');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/progress/${taskId}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      setMessage(data.message);
      if (data.progress === 100) {
        setTimeout(onComplete, 1000);
      }
    };

    return () => {
      socket.close();
    };
  }, [taskId, onComplete]);

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};