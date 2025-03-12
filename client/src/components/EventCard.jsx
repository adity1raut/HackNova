import React from 'react';
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl w-80 h-56 flex flex-col justify-between"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.name}</h2>
      
      <div className="text-gray-700 text-lg space-y-2">
        <p className="flex items-center gap-2">
          <CalendarDays size={20} className="text-blue-500" /> {event.date}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={20} className="text-green-500" /> {event.time}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={20} className="text-red-500" /> {event.location}
        </p>
        <p className="flex items-center gap-2">
          <User size={20} className="text-purple-500" /> {event.faculty}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
