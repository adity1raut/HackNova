import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const TimeScheduler = () => {
  const email = localStorage.getItem("email");
  const [scheduleData, setScheduleData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState([]);

  // Map weekday names to numeric values
  const dayMapping = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // Generate week days based on current date
  useEffect(() => {
    const days = [];
    const day = new Date(currentDate);
    day.setDate(day.getDate() - day.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    setCurrentWeek(days);
  }, [currentDate]);

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/schedule/${email}`);
        console.log("Raw Schedule Data:", response.data);

        let transformedData = [];

        Object.keys(dayMapping).forEach((day) => {
          (response.data[day] || []).forEach((event, index) => {
            if (!event.time) return;

            // Parse time string (Handles "10:00 AM" & "21:00 PM")
            const match = event.time.match(/(\d+):(\d+) (\w+)?/);
            if (!match) return;

            let [_, hour, minute, period] = match;
            hour = parseInt(hour, 10);
            minute = parseInt(minute, 10);

            if (period) {
              if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
              if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
            }

            // Set start date for the correct weekday
            const startDate = new Date(currentDate);
            const today = startDate.getDay();
            const targetDay = dayMapping[day];

            // Adjust to the correct weekday
            const dayDiff = targetDay - today;
            startDate.setDate(startDate.getDate() + dayDiff);
            startDate.setHours(hour, minute, index * 5, 0); // Add offset to avoid duplicate timestamps

            // Set end date (Assume 1-hour duration)
            const endDate = new Date(startDate);
            endDate.setHours(hour + 1, minute, index * 5, 0);

            transformedData.push({
              title: event.subject || "Unknown Event",
              startDate,
              endDate,
              day: targetDay,
            });
          });
        });

        console.log("Transformed Schedule Data:", transformedData);
        setScheduleData(transformedData);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    fetchSchedule();
  }, [currentDate, email]);

  // Navigate to previous week
  const goToPrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  // Format time to display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Create time slots from 6 AM to 9 PM
  const timeSlots = [];
  for (let i = 6; i <= 21; i++) {
    timeSlots.push(i);
  }

  // Get events for a specific day and hour
  const getEventsForSlot = (dayIndex, hour) => {
    return scheduleData.filter(event => {
      const eventDay = event.startDate.getDay();
      const eventHour = event.startDate.getHours();
      return eventDay === dayIndex && eventHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Calendar className="mr-2" size={20} />
          <h2 className="text-lg font-semibold">
            {currentWeek.length > 0 && 
              `${currentWeek[0].toLocaleDateString()} - ${currentWeek[6].toLocaleDateString()}`
            }
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={goToPrevWeek}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
          >
            Today
          </button>
          <button 
            onClick={goToNextWeek}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-8 border rounded-lg overflow-hidden">
        {/* Time column */}
        <div className="border-r bg-gray-50">
          <div className="h-12 border-b"></div>
          {timeSlots.map(hour => (
            <div key={`time-${hour}`} className="h-16 border-b flex items-start px-2 pt-1">
              <span className="text-xs text-gray-500">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {currentWeek.map((day, index) => (
          <div key={`day-${index}`} className="border-r last:border-r-0">
            {/* Day header */}
            <div className={`h-12 border-b flex flex-col items-center justify-center 
              ${day.getDate() === new Date().getDate() && 
                day.getMonth() === new Date().getMonth() && 
                day.getFullYear() === new Date().getFullYear() 
                ? 'bg-blue-50' : ''}`}>
              <span className="text-xs font-medium">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className={`text-sm mt-1 font-bold
                ${day.getDate() === new Date().getDate() && 
                  day.getMonth() === new Date().getMonth() && 
                  day.getFullYear() === new Date().getFullYear() 
                  ? 'text-blue-600' : ''}`}>
                {day.getDate()}
              </span>
            </div>
            
            {/* Time slots */}
            {timeSlots.map(hour => {
              const events = getEventsForSlot(index, hour);
              return (
                <div key={`slot-${index}-${hour}`} className="h-16 border-b relative">
                  {events.map((event, eventIndex) => (
                    <div 
                      key={`event-${index}-${hour}-${eventIndex}`}
                      className="absolute inset-x-0 mx-1 rounded-md bg-blue-100 border-l-4 border-blue-500 p-1 overflow-hidden"
                      style={{
                        top: '4px',
                        height: 'calc(100% - 8px)',
                        zIndex: eventIndex + 1
                      }}
                    >
                      <div className="flex items-center">
                        <Clock size={12} className="text-blue-500 mr-1" />
                        <span className="text-xs font-medium truncate">
                          {formatTime(event.startDate)}
                        </span>
                      </div>
                      <div className="text-xs truncate">{event.title}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeScheduler;