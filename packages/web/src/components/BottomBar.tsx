import React from 'react';
import { useStore } from '../store/useStore';

interface BottomBarProps {
  isInOffice: boolean;
  isDND: boolean;
  onLeaveOffice: () => void;
  onEnterOffice: () => void;
  onToggleDND: () => void;
  onToggleChat: () => void;
  onToggleCalendar: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  isInOffice,
  isDND,
  onLeaveOffice,
  onEnterOffice,
  onToggleDND,
  onToggleChat,
  onToggleCalendar,
}) => {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isDND
                ? 'bg-red-500'
                : isInOffice
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isDND ? 'Do Not Disturb' : isInOffice ? 'In Office' : 'Away'}
          </span>
        </div>

        {/* DND Toggle */}
        {isInOffice && (
          <button
            onClick={onToggleDND}
            className={`px-3 py-1 rounded-full text-sm ${
              isDND
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            } hover:bg-opacity-80`}
          >
            {isDND ? 'Disable DND' : 'Enable DND'}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Calendar Button */}
        <button
          onClick={onToggleCalendar}
          className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Calendar</span>
        </button>

        {/* Enter/Leave Office Button */}
        <button
          onClick={isInOffice ? onLeaveOffice : onEnterOffice}
          className={`px-4 py-2 rounded-lg ${
            isInOffice
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isInOffice ? 'Leave Office' : 'Enter Office'}
        </button>
      </div>
    </div>
  );
}; 