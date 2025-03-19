import React from 'react';
import type { ChatThread } from '@cospace/shared';

interface ChatProps {
  thread: ChatThread;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ thread, onClose }) => {
  return (
    <div className="fixed right-4 bottom-20 w-96 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{thread.name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="p-4">
        <p>Chat functionality coming soon...</p>
      </div>
    </div>
  );
}; 