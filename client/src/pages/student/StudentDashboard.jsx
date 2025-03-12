import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import EventCard from '../../components/EventCard';
// import { getEvents } from '../../services/eventService';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      // const data = await getEvents();
      const data = []; // Simulating API call (replace with real API fetch)
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Hardcoded events with locations, time, and dummy faculty
  const staticEvents = [
    { _id: '1', name: 'Holika Dahana', date: '2025-03-13', time: '7:00 PM', location: 'Central Ground', faculty: 'Dr. A. Sharma' },
    { _id: '2', name: 'Gudi Padawa', date: '2025-10-30', time: '10:00 AM', location: 'Main Auditorium', faculty: 'Prof. R. Verma' },
    { _id: '3', name: 'Pragyaa', date: '2024-02-21', time: '9:30 AM', location: 'Tech Hall A', faculty: 'Dr. M. Kapoor' },
    { _id: '4', name: 'Zenith', date: '2024-03-10', time: '5:00 PM', location: 'Conference Room 3', faculty: 'Prof. L. Patel' },
    { _id: '5', name: 'Utsav', date: '2024-03-08', time: '6:00 PM', location: 'Cultural Hall', faculty: 'Dr. P. Singh' },
    { _id: '6', name: 'Ramegadon', date: '2025-02-23', time: '3:00 PM', location: 'Auditorium B', faculty: 'Prof. K. Joshi' },
    { _id: '7', name: 'Hackfusion', date: '2025-02-21', time: '8:30 AM', location: 'Innovation Lab', faculty: 'Dr. S. Mehta' }
  ];

  const allEvents = [...events, ...staticEvents];

  const filteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return allEvents.filter(event => new Date(event.date) >= today);
    } else if (filter === 'past') {
      return allEvents.filter(event => new Date(event.date) < today);
    }
    return allEvents;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userType="student" />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded ${
                filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded ${
                filter === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Past Events
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              All Events
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading events...</p>
        ) : filteredEvents().length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents().map(event => (
              <EventCard key={event._id} event={event} userType="student" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
