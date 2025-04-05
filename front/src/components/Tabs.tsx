// components/Tabs.tsx
import React from 'react';

interface TabProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export const Tab: React.FC<TabProps> = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 text-sm font-medium ${
        active
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
};