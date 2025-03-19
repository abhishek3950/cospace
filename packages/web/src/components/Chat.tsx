import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';

interface ChatProps {
  onClose: () => void;
  activeThreadId: string | null;
}

const EMOJI_LIST = ['😊', '👍', '❤️', '🎉', '🔥', '😂', '🤔', '👋', '✨', '🙌'];

export const Chat: React.FC<ChatProps> = ({ onClose, activeThreadId }) => {
  const { chatState, setActiveThread, sendMessage } = useStore();
  const { threads, messages } = chatState;
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = activeThreadId ? threads.find(t => t.id === activeThreadId) : null;
  const activeMessages = activeThreadId ? messages[activeThreadId] || [] : [];

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
  };

  const handleBackToThreads = () => {
    setActiveThread(null);
  };

  const handleSendMessage = () => {
    if (!activeThreadId || !messageText.trim()) return;
    
    sendMessage({
      threadId: activeThreadId,
      content: messageText,
      type: 'text',
      senderId: 'currentUser',
      timestamp: new Date().toISOString(),
    });
    
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeThreadId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      sendMessage({
        threadId: activeThreadId,
        content: reader.result as string,
        type: 'image',
        senderId: 'currentUser',
        timestamp: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-blue-500 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          {activeThread && (
            <button 
              onClick={handleBackToThreads}
              className="mr-2 hover:bg-blue-600 rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h3 className="font-medium">
            {activeThread ? activeThread.name : 'Chat'}
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-blue-600 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {!activeThread ? (
          // Thread List
          <div className="divide-y divide-gray-200">
            {/* General Chat (always first) */}
            <div
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleThreadClick('general')}
            >
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                #
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">General</h4>
                <p className="text-sm text-gray-500 truncate">
                  {messages['general']?.[messages['general'].length - 1]?.content || 'Office-wide chat'}
                </p>
              </div>
            </div>
            
            {/* Direct Message Threads */}
            {threads.filter(thread => thread.id !== 'general').map(thread => (
              <div
                key={thread.id}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleThreadClick(thread.id)}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  {thread.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{thread.name}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {messages[thread.id]?.[messages[thread.id].length - 1]?.content || 'Start a conversation'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Chat Messages
          <div className="p-4 space-y-4">
            {activeMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === 'currentUser'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900'
                  } shadow`}
                >
                  {message.type === 'image' ? (
                    <img src={message.content} alt="Shared" className="max-w-full rounded" />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      {activeThread && (
        <div className="p-3 bg-white border-t">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Emoji Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                😊
              </button>
              
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                📎
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Simple Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 