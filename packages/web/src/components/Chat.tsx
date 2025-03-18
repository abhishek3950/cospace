import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { User, ChatMessage } from '@cospace/shared';

interface ChatProps {
  spaceId: string | null;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ spaceId, onClose }) => {
  const { currentUser, users } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for now
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'user1',
      receiverId: spaceId,
      content: 'Hello everyone!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: 'text',
      isPrivate: false,
    },
    {
      id: '2',
      senderId: 'user2',
      receiverId: spaceId,
      content: 'Hi there!',
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      type: 'text',
      isPrivate: false,
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    // TODO: Implement message sending
    console.log('Sending message:', {
      content: newMessage,
      senderId: currentUser.id,
      receiverId: selectedUser?.id ?? spaceId,
      isPrivate: !!selectedUser,
    });

    setNewMessage('');
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (!msg.isPrivate && !spaceId) || // Show non-private messages in general chat
      (!msg.isPrivate && msg.receiverId === spaceId) || // Show space messages
      (msg.isPrivate &&
        selectedUser &&
        ((msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
          (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id))) // Show private messages
  );

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {selectedUser
            ? `Chat with ${selectedUser.name}`
            : spaceId
            ? 'Space Chat'
            : 'General Chat'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>

      {/* User List (for private chats) */}
      {!spaceId && !selectedUser && (
        <div className="border-b border-gray-200">
          <div className="p-2 text-sm font-medium text-gray-500">Online Users</div>
          <div className="max-h-48 overflow-y-auto">
            {users
              .filter((u) => u.id !== currentUser?.id && u.isInOffice)
              .map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full p-2 flex items-center hover:bg-gray-50"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{
                      backgroundColor: user.isDND
                        ? '#FFA000'
                        : user.status === 'online'
                        ? '#4CAF50'
                        : '#9E9E9E',
                    }}
                  />
                  <span className="text-sm">{user.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const sender = users.find((u) => u.id === message.senderId);
            const isOwnMessage = message.senderId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-medium mb-1">
                      {sender?.name || 'Unknown'}
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}; 