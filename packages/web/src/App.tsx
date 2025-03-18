import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Workspace } from './components/Workspace';
import { Login } from './components/Login';
import { useStore } from './store/useStore';
import { sampleSpaces } from './data/sampleLayout';
import type { User } from '@cospace/shared';

const sampleUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    organizationId: 'org-1',
    position: { x: 52, y: 12 },
    status: 'online',
    currentSpace: 'desk-1',
    isInOffice: true,
    isDND: false,
    calendarConnected: true,
    currentMeeting: null,
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    organizationId: 'org-1',
    position: { x: 67, y: 12 },
    status: 'busy',
    currentSpace: 'desk-2',
    isInOffice: true,
    isDND: false,
    calendarConnected: true,
    currentMeeting: {
      id: 'meeting-1',
      title: 'Team Standup',
      endTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    },
  },
  {
    id: 'user-3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    organizationId: 'org-1',
    position: { x: 15, y: 15 },
    status: 'busy',
    currentSpace: 'meeting-room-1',
    isInOffice: true,
    isDND: true,
    calendarConnected: false,
    currentMeeting: null,
  },
];

export const App: React.FC = () => {
  const { currentUser, setCurrentUser, addSpace } = useStore();

  useEffect(() => {
    // Initialize with sample data
    setCurrentUser(sampleUsers[0]); // Set current user as Alice
    sampleSpaces.forEach(space => addSpace(space));
  }, []);

  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/workspace" replace /> : <Login />
            }
          />
          <Route
            path="/workspace"
            element={
              currentUser ? <Workspace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={<Navigate to="/workspace" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}; 