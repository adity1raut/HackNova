import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TimeScheduler = () => {
  const email = localStorage.getItem("email");
  const [scheduleData, setScheduleData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const dayMapping = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const fetchSchedule = async (selectedDate) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/schedule/${email}`);
      console.log("Raw Schedule Data:", response.data);

      let transformedData = [];

      Object.entries(response.data).forEach(([day, events]) => {
        if (!dayMapping.hasOwnProperty(day.toLowerCase())) return;
        const targetDay = dayMapping[day.toLowerCase()];

        events.forEach((event, index) => {
          if (!event.time) return;

          const match = event.time.match(/(\d+):(\d+)\s?(AM|PM)?/i);
          if (!match) return;

          let [_, hour, minute, period] = match;
          hour = parseInt(hour, 10);
          minute = parseInt(minute, 10);

          if (period) {
            if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
            if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
          }

          const startDate = moment(selectedDate).startOf("week").add(targetDay, "days").toDate();
          startDate.setHours(hour, minute, 0, 0);

          const endDate = new Date(startDate);
          endDate.setHours(hour + 1, minute, 0, 0);

          transformedData.push({
            id: `${day}-${index}`,
            title: event.subject || "No Title",
            start: startDate,
            end: endDate,
          });
        });
      });

      transformedData.sort((a, b) => a.start - b.start);

      console.log("Transformed Schedule Data:", transformedData);
      setScheduleData(transformedData);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  useEffect(() => {
    fetchSchedule(currentDate);
  }, [currentDate]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div style={{ height: "auto" }} className="pt-25">
      <Calendar
        localizer={localizer}
        events={scheduleData}
        startAccessor="start"
        endAccessor="end"
        style={{ border: "1px solid #ddd" }}
        defaultView="week"
        views={["week", "day", "agenda"]}
        date={currentDate}
        onNavigate={handleNavigate} // Handles next/previous week
      />
    </div>
  );
};

export default TimeScheduler;
