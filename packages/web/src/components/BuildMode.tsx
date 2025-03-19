import React from 'react';
import type { WorkspaceObject } from '@cospace/shared';

// Props interface for the BuildMode component
interface BuildModeProps {
  onClose: () => void;                    // Handler for closing the build mode panel
  existingObjects?: WorkspaceObject[];     // List of objects already in the workspace
  onDeleteObject?: (id: string) => void;   // Handler for deleting workspace objects
}

export const BuildMode: React.FC<BuildModeProps> = ({
  onClose,
  existingObjects = [],
  onDeleteObject,
}) => {
  // Define available object types with type safety
  const objectTypes = ['dog', 'plant', 'car', 'chair', 'table', 'lamp'] as const;

  // Handle drag start event for object placement
  const handleDragStart = (e: React.DragEvent, type: typeof objectTypes[number]) => {
    e.dataTransfer.setData('objectType', type);
  };

  return (
    // Main container with fixed positioning
    <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4">
      {/* Header section with title and close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Build Mode</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Object selection grid */}
        <div>
          <h3 className="text-sm font-medium mb-2">Objects</h3>
          <div className="grid grid-cols-3 gap-2">
            {objectTypes.map(type => (
              <div
                key={type}
                draggable
                onDragStart={e => handleDragStart(e, type)}
                className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center text-2xl cursor-move hover:bg-gray-200"
              >
                {/* Display appropriate emoji for each object type */}
                {type === 'dog' && '🐕'}
                {type === 'plant' && '🌿'}
                {type === 'car' && '🚗'}
                {type === 'chair' && '🪑'}
                {type === 'table' && '🪟'}
                {type === 'lamp' && '💡'}
              </div>
            ))}
          </div>
        </div>

        {/* List of existing objects */}
        {existingObjects.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Existing Objects</h3>
            <div className="space-y-2">
              {existingObjects.map(object => (
                <div
                  key={object.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  {/* Object type with icon */}
                  <div className="flex items-center">
                    <span className="text-xl mr-2">
                      {object.type === 'dog' && '🐕'}
                      {object.type === 'plant' && '🌿'}
                      {object.type === 'car' && '🚗'}
                      {object.type === 'chair' && '🪑'}
                      {object.type === 'table' && '🪟'}
                      {object.type === 'lamp' && '💡'}
                    </span>
                    <span className="text-sm">{object.type}</span>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteObject?.(object.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 