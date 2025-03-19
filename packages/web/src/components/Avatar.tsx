import React, { useState, useEffect } from 'react';
import type { User } from '@cospace/shared';
import { useStore } from '../store/useStore';

interface AvatarProps {
  user: User;
  onMove: (userId: string, newPosition: { x: number; y: number }) => void;
  isCurrentUser: boolean;
  onStartChat: () => void;
}

const PROXIMITY_THRESHOLD = 20; // percentage units

export const Avatar: React.FC<AvatarProps> = ({ user, onMove, isCurrentUser, onStartChat }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const { setUserDND, setActiveThread, createDirectMessageThread, currentUser, setUserAudioEnabled, setUserVideoEnabled } = useStore();
  const [visualPosition, setVisualPosition] = useState(user.position);
  const [showChatCTA, setShowChatCTA] = useState(false);
  const [isNearby, setIsNearby] = useState(false);

  // Check proximity to current user
  useEffect(() => {
    if (!currentUser || isCurrentUser) return;

    const dx = currentUser.position.x - user.position.x;
    const dy = currentUser.position.y - user.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    setIsNearby(distance <= PROXIMITY_THRESHOLD);
  }, [currentUser?.position, user.position, isCurrentUser]);

  useEffect(() => {
    setIsMoving(true);
    setVisualPosition(user.position);
    const timer = setTimeout(() => setIsMoving(false), 1000);
    return () => clearTimeout(timer);
  }, [user.position]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isCurrentUser) return;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!isCurrentUser) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onMove(user.id, { x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isCurrentUser) return;
    e.preventDefault();
    setUserDND(user.id, !user.isDND);
  };

  const handleToggleAudio = () => {
    if (!currentUser) return;
    setUserAudioEnabled(currentUser.id, !currentUser.isAudioEnabled);
  };

  const handleToggleVideo = () => {
    if (!currentUser) return;
    setUserVideoEnabled(currentUser.id, !currentUser.isVideoEnabled);
  };

  const handleStartChat = () => {
    const threadId = createDirectMessageThread(user.id);
    setActiveThread(threadId);
    onStartChat();
  };

  const getStatusColor = () => {
    if (user.isDND) return 'bg-red-500';
    switch (user.status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (user.isDND) return 'Do Not Disturb';
    if (user.currentMeeting) return `In Meeting: ${user.currentMeeting.title}`;
    return user.status.charAt(0).toUpperCase() + user.status.slice(1);
  };

  const getMovementClass = () => {
    if (!isMoving) return '';
    return 'animate-bounce-subtle';
  };

  return (
    <div
      className={`absolute cursor-move ${isDragging ? 'z-50' : 'z-10'} transition-all duration-1000 ease-in-out ${getMovementClass()}`}
      style={{
        left: `${visualPosition.x}%`,
        top: `${visualPosition.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      draggable={isCurrentUser}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => !isCurrentUser && setShowChatCTA(true)}
      onMouseLeave={() => !isCurrentUser && setShowChatCTA(false)}
    >
      <div className="relative group">
        {/* Audio/Video Controls - Only show when nearby or for current user */}
        {(isNearby || isCurrentUser) && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-full shadow-lg px-2 py-1">
            <button
              onClick={handleToggleAudio}
              className={`p-1 rounded-full ${user.isAudioEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              title={user.isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {user.isAudioEnabled ? '🎤' : '🔇'}
            </button>
            <button
              onClick={handleToggleVideo}
              className={`p-1 rounded-full ${user.isVideoEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              title={user.isVideoEnabled ? 'Stop Video' : 'Start Video'}
            >
              {user.isVideoEnabled ? '📹' : '🚫'}
            </button>
          </div>
        )}

        {/* Human Avatar Figure */}
        <div className="relative w-16 h-24 flex flex-col items-center">
          {/* Head */}
          <div className={`w-10 h-10 rounded-full ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} border-2 border-white flex items-center justify-center`}>
            {/* Face */}
            <div className="text-white text-sm font-medium">{user.name.charAt(0)}</div>
          </div>
          
          {/* Body */}
          <div className={`w-8 h-12 ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} rounded-t-lg mt-1`}>
            {/* Arms */}
            <div className="absolute left-0 right-0 top-4 flex justify-between">
              <div className={`w-3 h-6 ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} rounded-full -ml-2`} /> {/* Left arm */}
              <div className={`w-3 h-6 ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} rounded-full -mr-2`} /> {/* Right arm */}
            </div>
          </div>
          
          {/* Legs */}
          <div className="flex gap-1 -mt-1">
            <div className={`w-3 h-6 ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} rounded-b-lg`} /> {/* Left leg */}
            <div className={`w-3 h-6 ${user.isDND ? 'bg-red-400' : 'bg-blue-400'} rounded-b-lg`} /> {/* Right leg */}
          </div>
        </div>

        {/* Audio/Video Indicators */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          {user.isAudioEnabled && (
            <div className="w-3 h-3 bg-green-500 rounded-full" title="Audio enabled" />
          )}
          {user.isVideoEnabled && (
            <div className="w-3 h-3 bg-blue-500 rounded-full" title="Video enabled" />
          )}
        </div>

        {/* Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`} />
        
        {/* Tooltip */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 hidden group-hover:block whitespace-nowrap">
          <div className="bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1">
            {user.name} - {getStatusText()}
            {isCurrentUser && <span className="ml-2 text-gray-400">(Right-click to toggle DND)</span>}
          </div>
        </div>
      </div>

      {/* Chat CTA */}
      {showChatCTA && !isCurrentUser && (
        <button
          onClick={handleStartChat}
          className="absolute top-0 left-full ml-2 whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-lg text-sm text-blue-500 hover:bg-blue-50"
        >
          Chat with {user.name}
        </button>
      )}
    </div>
  );
}; 