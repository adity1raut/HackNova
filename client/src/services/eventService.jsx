// client/src/services/eventService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios to include the token in requests
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all events for the logged-in user
 * For students, this will return all events
 * For faculty, this will return only their created events
 */
export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`, {
    headers: authHeader()
  });
  return response.data;
};

/**
 * Get a specific event by ID
 * 
 * @param {string} id - The event ID
 * @returns {Promise<Object>} - The event data
 */
export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`, {
    headers: authHeader()
  });
  return response.data;
};

/**
 * Create a new event (faculty only)
 * 
 * @param {Object} eventData - The event data to create
 * @returns {Promise<Object>} - The created event
 */
export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData, {
    headers: authHeader()
  });
  return response.data;
};

/**
 * Update an existing event (faculty only)
 * 
 * @param {string} id - The event ID to update
 * @param {Object} eventData - The updated event data
 * @returns {Promise<Object>} - The updated event
 */
export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
    headers: authHeader()
  });
  return response.data;
};

/**
 * Delete an event (faculty only)
 * 
 * @param {string} id - The event ID to delete
 * @returns {Promise<Object>} - The response data
 */
export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/events/${id}`, {
    headers: authHeader()
  });
  return response.data;
};

/**
 * Search events by keyword (title or description)
 * 
 * @param {string} keyword - The search keyword
 * @returns {Promise<Array>} - The filtered events
 */
export const searchEvents = async (keyword) => {
  const allEvents = await getEvents();
  
  if (!keyword) return allEvents;
  
  const lowercaseKeyword = keyword.toLowerCase();
  
  return allEvents.filter(event => 
    event.title.toLowerCase().includes(lowercaseKeyword) || 
    event.description.toLowerCase().includes(lowercaseKeyword)
  );
};

/**
 * Filter events by date range
 * 
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Promise<Array>} - The filtered events
 */
export const filterEventsByDateRange = async (startDate, endDate) => {
  const allEvents = await getEvents();
  
  if (!startDate && !endDate) return allEvents;
  
  return allEvents.filter(event => {
    const eventDate = new Date(event.date);
    
    if (startDate && endDate) {
      return eventDate >= startDate && eventDate <= endDate;
    } else if (startDate) {
      return eventDate >= startDate;
    } else if (endDate) {
      return eventDate <= endDate;
    }
    
    return true;
  });
};

/**
 * Get upcoming events (events with dates in the future)
 * 
 * @returns {Promise<Array>} - The upcoming events
 */
export const getUpcomingEvents = async () => {
  const allEvents = await getEvents();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return allEvents.filter(event => new Date(event.date) >= today);
};

/**
 * Get past events (events with dates in the past)
 * 
 * @returns {Promise<Array>} - The past events
 */
export const getPastEvents = async () => {
  const allEvents = await getEvents();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return allEvents.filter(event => new Date(event.date) < today);
};

/**
 * Get events for a specific date
 * 
 * @param {Date} date - The date to filter by
 * @returns {Promise<Array>} - The events on the specified date
 */
export const getEventsByDate = async (date) => {
  const allEvents = await getEvents();
  
  // Convert to date string for comparison (YYYY-MM-DD)
  const dateStr = date.toISOString().split('T')[0];
  
  return allEvents.filter(event => {
    const eventDateStr = new Date(event.date).toISOString().split('T')[0];
    return eventDateStr === dateStr;
  });
};

/**
 * Get events by location
 * 
 * @param {string} location - The location to filter by
 * @returns {Promise<Array>} - The events at the specified location
 */
export const getEventsByLocation = async (location) => {
  const allEvents = await getEvents();
  
  if (!location) return allEvents;
  
  const lowercaseLocation = location.toLowerCase();
  
  return allEvents.filter(event => 
    event.location.toLowerCase().includes(lowercaseLocation)
  );
};

/**
 * Get events by faculty name
 * 
 * @param {string} facultyName - The faculty name to filter by
 * @returns {Promise<Array>} - The events by the specified faculty
 */
export const getEventsByFaculty = async (facultyName) => {
  const allEvents = await getEvents();
  
  if (!facultyName) return allEvents;
  
  const lowercaseFacultyName = facultyName.toLowerCase();
  
  return allEvents.filter(event => 
    event.facultyName.toLowerCase().includes(lowercaseFacultyName)
  );
};

/**
 * Check if current user can edit an event
 * 
 * @param {Object} event - The event to check
 * @returns {boolean} - Whether the user can edit the event
 */
export const canEditEvent = (event) => {
  const userType = localStorage.getItem('userType');
  
  // Only faculty can edit events
  if (userType !== 'faculty') return false;
  
  // This check would be more robust with user IDs
  // For now we assume faculty can only edit their own events
  // which is handled server-side in the actual implementation
  return true;
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  filterEventsByDateRange,
  getUpcomingEvents,
  getPastEvents,
  getEventsByDate,
  getEventsByLocation,
  getEventsByFaculty,
  canEditEvent
};