import React from 'react';
import type { Space as SpaceType } from '@cospace/shared';

interface SpaceProps {
  space: SpaceType;
  onClick: () => void;
  isSelected: boolean;
}

export const Space: React.FC<SpaceProps> = ({ space, onClick, isSelected }) => {
  const getSpaceStyles = () => {
    const baseStyles = 'absolute rounded-lg cursor-pointer transition-all duration-200';
    switch (space.type) {
      case 'meeting_room':
        return `${baseStyles} bg-blue-50 border-2 ${
          isSelected ? 'border-blue-500' : 'border-blue-200'
        }`;
      case 'desk':
        return `${baseStyles} bg-gray-50 border-2 ${
          isSelected ? 'border-gray-500' : 'border-gray-200'
        }`;
      case 'common_area':
        return `${baseStyles} bg-green-50 border-2 ${
          isSelected ? 'border-green-500' : 'border-green-200'
        }`;
      default:
        return baseStyles;
    }
  };

  const getSpaceIcon = () => {
    switch (space.type) {
      case 'meeting_room':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'desk':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'common_area':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={getSpaceStyles()}
      style={{
        left: `${space.position.x}%`,
        top: `${space.position.y}%`,
        width: `${space.width}%`,
        height: `${space.height}%`,
      }}
      onClick={onClick}
    >
      <div className="p-2 flex flex-col items-center justify-center h-full">
        {getSpaceIcon()}
        <span className="mt-2 text-sm font-medium">{space.name}</span>
        {space.type === 'meeting_room' && (
          <span className="text-xs text-gray-500">
            {space.occupants.length}/{space.capacity}
          </span>
        )}
      </div>
    </div>
  );
}; 