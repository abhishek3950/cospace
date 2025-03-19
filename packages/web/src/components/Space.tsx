import React from 'react';
import type { Space as SpaceType } from '@cospace/shared';
import { useStore } from '../store/useStore';

interface SpaceProps {
  space: SpaceType;
  onClick: () => void;
  isSelected: boolean;
}

export const Space: React.FC<SpaceProps> = ({ space, onClick, isSelected }) => {
  const { currentUser, setCurrentUser } = useStore();

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || !currentUser.currentMeeting || currentUser.currentSpace !== space.id) return;

    setCurrentUser({
      ...currentUser,
      currentMeeting: {
        ...currentUser.currentMeeting,
        isLocked: !currentUser.currentMeeting.isLocked,
      },
    });
  };

  const isLocked = space.occupants?.some(userId => {
    const user = useStore.getState().users.find(u => u.id === userId);
    return user?.currentMeeting?.isLocked;
  });

  const canEnter = !isLocked || space.occupants?.includes(currentUser?.id || '');

  return (
    <div
      className={`absolute cursor-pointer ${isSelected ? 'z-20' : 'z-0'}`}
      style={{
        left: `${space.position.x}%`,
        top: `${space.position.y}%`,
        width: `${space.width}%`,
        height: `${space.height}%`,
      }}
      onClick={canEnter ? onClick : undefined}
    >
      <div
        className={`w-full h-full rounded-lg border-2 transition-colors ${
          isSelected
            ? 'border-blue-500 bg-blue-100 bg-opacity-50'
            : isLocked
            ? 'border-red-500 bg-red-100 bg-opacity-30'
            : 'border-gray-300 bg-white bg-opacity-30'
        }`}
      >
        <div className="absolute top-2 left-2 text-sm font-medium">
          {space.name}
          {space.type === 'meeting_room' && (
            <span className="ml-2 text-xs text-gray-500">
              ({space.occupants?.length || 0}/{space.capacity})
            </span>
          )}
        </div>

        {/* Lock indicator and control */}
        {space.type === 'meeting_room' && (
          <div 
            className="absolute top-2 right-2 p-1 rounded hover:bg-white/50"
            onClick={handleToggleLock}
          >
            {isLocked ? '🔒' : '🔓'}
          </div>
        )}

        {/* Occupants list */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-xs text-gray-600">
            {space.occupants?.map(userId => {
              const user = useStore.getState().users.find(u => u.id === userId);
              return user ? (
                <div key={userId} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {user.name}
                  {user.currentMeeting && (
                    <span className="ml-1 text-xs text-gray-400">
                      (In meeting: {user.currentMeeting.title})
                    </span>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 