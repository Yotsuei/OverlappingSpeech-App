// components/TranscriptionResult.tsx
import React from 'react';

interface TranscriptionResultProps {
  taskId: string;
  onClear: () => void;
}

export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({ taskId, onClear }) => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const fetchTranscription = async () => {
      try {
        const response = await apiClient.get(`/transcription/${taskId}`);
        setTranscript(response.data.transcription);
      } catch (error) {
        console.error('Failed to fetch transcription');
      }
    };
    fetchTranscription();
  }, [taskId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transcription Result</h3>
        <div className="space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Copy
          </button>
          <a
            href={`http://localhost:8000/download/${taskId}/transcript.txt`}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download
          </a>
          <button
            onClick={onClear}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{transcript}</pre>
    </div>
  );
};