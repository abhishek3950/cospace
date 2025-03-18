import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Space } from '@/components/Space';
import { Avatar } from '@/components/Avatar';
import { Chat } from '@/components/Chat';
import { Calendar } from '@/components/Calendar';
import { BottomBar } from '@/components/BottomBar';
import type { User } from '@cospace/shared';

export const Workspace: React.FC = () => {
  const {
    currentUser,
    users,
    spaces,
    setUserPosition,
    setIsInOffice,
    setIsDND,
    setCurrentSpace,
  } = useStore();

  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    // Update user's position when they move
    const handleMouseMove = (e: MouseEvent) => {
      if (!currentUser?.isInOffice) return;

      const workspace = document.getElementById('workspace');
      if (!workspace) return;

      const rect = workspace.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setUserPosition(currentUser.id, { x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentUser]);

  const handleSpaceClick = (spaceId: string) => {
    if (selectedSpace === spaceId) {
      setSelectedSpace(null);
      setCurrentSpace(currentUser?.id, null);
    } else {
      setSelectedSpace(spaceId);
      setCurrentSpace(currentUser?.id, spaceId);
    }
  };

  const handleAvatarClick = (user: User) => {
    if (user.id === currentUser?.id) return;
    setShowChat(true);
  };

  const handleLeaveOffice = () => {
    setIsInOffice(currentUser?.id, false);
  };

  const handleEnterOffice = () => {
    setIsInOffice(currentUser?.id, true);
  };

  const handleToggleDND = () => {
    setIsDND(currentUser?.id, !currentUser?.isDND);
  };

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Workspace Area */}
      <div
        id="workspace"
        className="relative w-full h-[calc(100vh-64px)] overflow-hidden"
      >
        {/* Spaces */}
        {spaces.map(space => (
          <Space
            key={space.id}
            space={space}
            onClick={() => handleSpaceClick(space.id)}
            isSelected={selectedSpace === space.id}
          />
        ))}

        {/* Users */}
        {users
          .filter(user => user.isInOffice)
          .map(user => (
            <Avatar
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUser?.id}
              onClick={() => handleAvatarClick(user)}
            />
          ))}
      </div>

      {/* Bottom Bar */}
      <BottomBar
        isInOffice={currentUser?.isInOffice || false}
        isDND={currentUser?.isDND || false}
        onLeaveOffice={handleLeaveOffice}
        onEnterOffice={handleEnterOffice}
        onToggleDND={handleToggleDND}
        onToggleChat={() => setShowChat(true)}
        onToggleCalendar={() => setShowCalendar(true)}
      />

      {/* Chat Panel */}
      {showChat && (
        <Chat
          spaceId={selectedSpace}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Calendar Panel */}
      {showCalendar && (
        <Calendar onClose={() => setShowCalendar(false)} />
      )}
    </div>
  );
}; 