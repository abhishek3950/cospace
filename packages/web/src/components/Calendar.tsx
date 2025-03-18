import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface CalendarProps {
  onClose: () => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  meetingLink?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ onClose }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCalendarConnected, setCurrentMeeting } = useStore();

  useEffect(() => {
    // Check if user has already authorized Google Calendar
    const checkAuth = async () => {
      const token = localStorage.getItem('googleCalendarToken');
      if (token) {
        setIsAuthorized(true);
        await fetchEvents();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthClick = async () => {
    // TODO: Implement Google Calendar OAuth flow
    try {
      // 1. Redirect to Google OAuth consent screen
      // 2. Handle callback with authorization code
      // 3. Exchange code for access token
      // 4. Store token in localStorage
      // 5. Set isAuthorized to true
      // 6. Fetch events
      setCalendarConnected(true);
    } catch (error) {
      console.error('Failed to authorize:', error);
    }
  };

  const fetchEvents = async () => {
    // TODO: Implement Google Calendar API call
    try {
      // Mock data for now
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Standup',
          startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 mins from now
          endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
          attendees: ['alice@example.com', 'bob@example.com'],
          meetingLink: 'https://meet.google.com/abc-defg-hij',
        },
        {
          id: '2',
          title: 'Product Review',
          startTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(), // 3 hours from now
          attendees: ['alice@example.com', 'carol@example.com'],
          meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
        },
      ];

      setEvents(mockEvents);

      // Check if user is in a meeting now
      const now = new Date().getTime();
      const currentMeeting = mockEvents.find(event => {
        const start = new Date(event.startTime).getTime();
        const end = new Date(event.endTime).getTime();
        return now >= start && now <= end;
      });

      if (currentMeeting) {
        setCurrentMeeting({
          id: currentMeeting.id,
          title: currentMeeting.title,
          endTime: currentMeeting.endTime,
        });
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const isEventNow = (event: CalendarEvent) => {
    const now = new Date().getTime();
    const start = new Date(event.startTime).getTime();
    const end = new Date(event.endTime).getTime();
    return now >= start && now <= end;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Calendar</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : !isAuthorized ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Connect your Google Calendar to see your meetings
            </p>
            <button
              onClick={handleAuthClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Connect Google Calendar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${
                  isEventNow(event)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="font-medium mb-2">{event.title}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  {event.meetingLink && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      Join Meeting
                    </a>
                  )}
                  <div className="text-xs text-gray-500">
                    {event.attendees.length} attendees
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 