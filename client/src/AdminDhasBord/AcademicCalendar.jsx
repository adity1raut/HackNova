import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const AcademicCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/getCurrentSemester")
      .then((res) => {
        const rawData = res.data.semester.calendar || [];

        const eventsMap = rawData.reduce((acc, item) => {
          acc[item.date] = { type: item.type, description: item.description };
          return acc;
        }, {});

        setCalendarData(rawData);
        setEvents(eventsMap);
      })
      .catch((err) => console.error("Error fetching calendar:", err));
  }, []);

  // Highlight holidays and exams
  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];

    if (events[dateStr]) {
      if (events[dateStr].type === "holiday") return "holiday-day";
      if (events[dateStr].type === "exam") return "exam-day";
    }
    return "";
  };

  // Handle date selection
  const handleDateClick = (value) => {
    const dateStr = value.toISOString().split("T")[0];
    setSelectedDate({ date: dateStr, ...events[dateStr] });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Academic Calendar</h2>
      
      <Calendar 
        tileClassName={tileClassName} 
        onClickDay={handleDateClick} // Capture click
      />

      {/* Display Selected Date Info */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Details for {selectedDate.date}</h3>
          <p><strong></strong> {selectedDate.type || "No event"}</p>
          <p><strong></strong> {selectedDate.description || "No description available"}</p>
        </div>
      )}

      <div className="mt-4">
        <div className="flex gap-4 mt-2">
          <span className="px-3 py-1 bg-red-500 text-white rounded">Holiday</span>
          <span className="px-3 py-1 bg-blue-500 text-white rounded">Exam</span>
          <span className="px-3 py-1 bg-yellow-500 text-white rounded">Current Date</span>
        </div>
      </div>

      <style>
        {`
          .holiday-day {
            background: #ffcccc !important;
            border-radius: 50%;
          }
          .exam-day {
            background: #cce5ff !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default AcademicCalendar;