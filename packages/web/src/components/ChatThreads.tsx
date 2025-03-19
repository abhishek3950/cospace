import React from 'react';
import type { ChatThread, User } from '@cospace/shared';

// Props interface for the ChatThreads component
interface ChatThreadsProps {
  threads: ChatThread[];           // List of all chat threads
  users: User[];                   // List of all users
  activeThreadId: string | null;   // Currently selected thread ID
  onThreadSelect: (threadId: string) => void;  // Handler for thread selection
  onClose: () => void;            // Handler for closing the threads panel
}

export const ChatThreads: React.FC<ChatThreadsProps> = ({
  threads,
  users,
  activeThreadId,
  onThreadSelect,
  onClose,
}) => {
  const getThreadName = (thread: ChatThread) => {
    if (thread.type === 'group') {
      return thread.name;
    }
    const otherParticipant = users.find(u => 
      u.id !== thread.participants[0] && thread.participants.includes(u.id)
    );
    return otherParticipant?.name || 'Unknown User';
  };

  return (
    // Main container with fixed positioning
    <div className="fixed right-4 bottom-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header section with title and close button */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          ✕
        </button>
      </div>
      
      {/* Scrollable threads list */}
      <div className="max-h-[60vh] overflow-y-auto">
        {threads.map(thread => (
          <div
            key={thread.id}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              activeThreadId === thread.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onThreadSelect(thread.id)}
          >
            {/* Thread item with message preview and unread count */}
            <div className="flex justify-between items-start">
              <div>
                {/* Thread name */}
                <div className="font-medium">{getThreadName(thread)}</div>
                {/* Last message preview */}
                {thread.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {thread.lastMessage}
                  </div>
                )}
              </div>
              {/* Unread message count badge */}
              {thread.unreadCount > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {thread.unreadCount}
                </div>
              )}
            </div>
            {/* Last message timestamp */}
            {thread.lastMessageTime && (
              <div className="text-xs text-gray-400 mt-1">
                {new Date(thread.lastMessageTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 