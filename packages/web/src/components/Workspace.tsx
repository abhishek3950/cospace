import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { Space, User, WorkspaceObject } from '@cospace/shared';
import { Avatar } from './Avatar';
import { Space as SpaceComponent } from './Space';
import { Chat } from './Chat';
import { BuildMode } from './BuildMode';
import { BottomBar } from './BottomBar';

interface ContextMenuPosition {
  x: number;
  y: number;
  percentX: number;
  percentY: number;
}

export const Workspace: React.FC = () => {
  const {
    currentUser,
    users,
    spaces,
    workspaceObjects,
    setUserPosition,
    chatState,
    setCurrentUser,
    setUserDND,
    addWorkspaceObject,
    removeWorkspaceObject,
  } = useStore();

  const [buildMode, setBuildMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle keyboard movement
  useEffect(() => {
    if (!currentUser) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const moveSpeed = 3; // Percentage points to move per keypress
      const newPosition = { ...currentUser.position };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, currentUser.position.y - moveSpeed);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(100, currentUser.position.y + moveSpeed);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, currentUser.position.x - moveSpeed);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(100, currentUser.position.x + moveSpeed);
          break;
        case 'b':
          if (e.ctrlKey) {
            setBuildMode(prev => !prev);
          }
          break;
        default:
          return;
      }

      setUserPosition(currentUser.id, newPosition);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentUser, setUserPosition]);

  // Handle click outside context menu to close it
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      percentX,
      percentY,
    });
  };

  const handleMoveHere = () => {
    if (!contextMenu || !currentUser) return;
    
    setUserPosition(currentUser.id, {
      x: contextMenu.percentX,
      y: contextMenu.percentY,
    });
    
    setContextMenu(null);
  };

  const handleUserMove = (userId: string, newPosition: { x: number; y: number }) => {
    setUserPosition(userId, newPosition);
  };

  const handleSpaceClick = (space: Space) => {
    if (!currentUser) return;

    if (currentUser.currentSpace === space.id) {
      // User is already in this space
      return;
    }

    // Calculate distance to space
    const dx = currentUser.position.x - space.position.x;
    const dy = currentUser.position.y - space.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if user is close enough to enter the space (within 5 units)
    if (distance <= 5) {
      setCurrentUser({
        ...currentUser,
        currentSpace: space.id,
        position: {
          x: space.position.x + space.width / 2,
          y: space.position.y + space.height / 2,
        },
      } as User);
    }
  };

  const handleToggleDND = () => {
    if (!currentUser) return;
    setUserDND(currentUser.id, !currentUser.isDND);
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleLeaveOffice = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      isInOffice: false,
      currentSpace: null,
      position: { x: 50, y: 50 }, // Center position in lobby
    });
  };

  const handleEnterOffice = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      isInOffice: true,
      position: { x: 15, y: 15 }, // Starting position in office
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const objectType = e.dataTransfer.getData('objectType') as WorkspaceObject['type'];
    
    if (!objectType) return;

    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;

    const newObject: WorkspaceObject = {
      id: `${objectType}-${Date.now()}`,
      type: objectType,
      position: { x: percentX, y: percentY },
      rotation: 0,
      scale: 1,
    };

    addWorkspaceObject(newObject);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden"
      onContextMenu={handleContextMenu}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {currentUser?.isInOffice && (
        <>
          {/* Spaces */}
          {spaces.map((space) => (
            <SpaceComponent
              key={space.id}
              space={space}
              onClick={() => handleSpaceClick(space)}
              isSelected={currentUser?.currentSpace === space.id}
            />
          ))}

          {/* Users */}
          {currentUser && (
            <Avatar
              key={currentUser.id}
              user={currentUser}
              onMove={handleUserMove}
              isCurrentUser={true}
              onStartChat={() => setIsChatOpen(true)}
            />
          )}
          {users.map((user) => (
            <Avatar
              key={user.id}
              user={user}
              onMove={handleUserMove}
              isCurrentUser={false}
              onStartChat={() => setIsChatOpen(true)}
            />
          ))}

          {/* Context Menu */}
          {contextMenu && (
            <div
              className="fixed z-50 bg-white rounded-lg shadow-lg py-2 px-4 cursor-pointer hover:bg-gray-50"
              style={{
                left: contextMenu.x,
                top: contextMenu.y,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={handleMoveHere}
            >
              Move Here
            </div>
          )}

          {/* Workspace Objects */}
          {workspaceObjects.map((object) => (
            <div
              key={object.id}
              className="absolute cursor-move"
              style={{
                left: `${object.position.x}%`,
                top: `${object.position.y}%`,
                transform: `rotate(${object.rotation}deg) scale(${object.scale})`,
              }}
            >
              {/* Render object based on type */}
              {object.type === 'dog' && '🐕'}
              {object.type === 'plant' && '🌿'}
              {object.type === 'car' && '🚗'}
              {object.type === 'chair' && '🪑'}
              {object.type === 'table' && '🪟'}
              {object.type === 'lamp' && '💡'}
            </div>
          ))}
        </>
      )}

      {!currentUser?.isInOffice && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to CoSpace</h1>
            <p className="text-gray-600 mb-8">Enter the office to collaborate with your team</p>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl z-40 overflow-hidden flex flex-col">
          <Chat
            onClose={() => setIsChatOpen(false)}
            activeThreadId={chatState.activeThreadId}
          />
        </div>
      )}

      {/* Build Mode */}
      {buildMode && (
        <BuildMode 
          onClose={() => setBuildMode(false)} 
          existingObjects={workspaceObjects}
          onDeleteObject={removeWorkspaceObject}
        />
      )}

      {/* Bottom Bar */}
      <BottomBar
        onToggleBuildMode={() => setBuildMode(!buildMode)}
        isInOffice={currentUser?.isInOffice || false}
        isDND={currentUser?.isDND || false}
        onLeaveOffice={handleLeaveOffice}
        onEnterOffice={handleEnterOffice}
        onToggleDND={handleToggleDND}
        onToggleChat={handleToggleChat}
      />
    </div>
  );
}; 