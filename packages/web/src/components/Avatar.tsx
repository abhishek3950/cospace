import React from 'react';
import type { User } from '@cospace/shared';

interface AvatarProps {
  user: User;
  isCurrentUser: boolean;
  onClick: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ user, isCurrentUser, onClick }) => {
  const getStatusColor = () => {
    if (user.isDND) return 'bg-red-500';
    switch (user.status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusText = () => {
    if (user.isDND) return 'Do Not Disturb';
    switch (user.status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Offline';
    }
  };

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${user.position.x}%`,
        top: `${user.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      <div className="relative">
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            isCurrentUser ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          }}
        >
          {getInitials(user.name)}
        </button>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor()}`}
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {user.name}
          <div className="text-gray-400">{getStatusText()}</div>
        </div>
      </div>
    </div>
  );
}; 