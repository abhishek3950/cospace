import React from 'react';
import { useStore } from './store/useStore';
import { Workspace } from './components/Workspace';

export const App: React.FC = () => {
  const { currentUser } = useStore();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to CoSpace</h1>
          <p className="text-gray-600">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Workspace />
    </div>
  );
}; 