import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { LoginCredentials, AuthResponse, User } from '@cospace/shared';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    organizationSlug: ''
  });
  const [step, setStep] = useState<'workspace' | 'credentials'>('workspace');
  const [error, setError] = useState<string | null>(null);
  const { setCurrentUser } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationSlug) {
      setError('Please enter your workspace name');
      return;
    }
    // TODO: Validate if organization exists
    setStep('credentials');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      const response: AuthResponse = {
        user: {
          id: '1',
          name: 'Demo User',
          email: formData.email,
          organizationId: '1',
          position: { x: 50, y: 50 },
          status: 'online',
          currentSpace: null,
          isInOffice: false,
          isDND: false,
          calendarConnected: false,
          currentMeeting: null,
          isAudioEnabled: false,
          isVideoEnabled: false,
        },
        organization: {
          id: '1',
          name: 'Demo Organization',
          slug: formData.organizationSlug,
          domain: 'demo.cospace.com',
          settings: {
            theme: {
              primaryColor: '#0ea5e9',
              logo: 'https://via.placeholder.com/150',
            },
            features: {
              maxUsers: 10,
              allowedRooms: ['meeting', 'common', 'private'],
            },
          },
        },
        token: 'demo-token',
      };

      setCurrentUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('organizationSlug', response.organization.slug);
      onLogin(response.user);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (step === 'workspace') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to CoSpace
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your workspace name to continue
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleWorkspaceSubmit}>
            <div>
              <label htmlFor="organizationSlug" className="block text-sm font-medium text-gray-700">
                Workspace Name
              </label>
              <div className="mt-1">
                <input
                  id="organizationSlug"
                  name="organizationSlug"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your-company"
                  value={formData.organizationSlug}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Example: acme-corp
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to {formData.organizationSlug}
          </h2>
          <button
            onClick={() => setStep('workspace')}
            className="mt-2 text-center text-sm text-blue-600 hover:text-blue-500 block w-full"
          >
            ← Change workspace
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleCredentialsSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 