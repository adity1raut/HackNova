import React, { useState, useEffect } from 'react';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: ''
  });
  
  useEffect(() => {
    if (event) {
      // Format date for the input field
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: formattedDate || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || ''
      });
    }
  }, [event]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;