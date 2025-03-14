import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAcademicTerm = () => {
  const [semester, setSemester] = useState(null);
  const [form, setForm] = useState({ startDate: "", endDate: "" });
  const [calendar, setCalendar] = useState([]);
  const [events, setEvents] = useState({});
  const [isSemesterActive, setIsSemesterActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/api/getCurrentSemester")
      .then((res) => {
        if (res.data.semester) {
          setSemester(res.data.semester);
          setForm({
            startDate: res.data.semester.startDate,
            endDate: res.data.semester.endDate
          });
          setCalendar(res.data.semester.calendar);
          
          const eventMap = res.data.semester.calendar.reduce((acc, event) => {
            acc[event.date] = { description: event.description, type: event.type };
            return acc;
          }, {});
          setEvents(eventMap);

          setIsSemesterActive(res.data.semester.isActive);
        }
      })
      .catch((err) => console.error("Error fetching semester:", err));
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateCalendar = () => {
    if (!form.startDate || !form.endDate) return;
    let start = new Date(form.startDate);
    let end = new Date(form.endDate);
    let dates = [];
    let newEvents = {};

    while (start <= end) {
      const dateStr = start.toISOString().split("T")[0];
      dates.push({ date: dateStr, description: "", type: "normal" });
      newEvents[dateStr] = { description: "", type: "normal" };
      start.setDate(start.getDate() + 1);
    }

    setCalendar(dates);
    setEvents(newEvents);
  };

  const startSemester = () => {
    console.log(calendar)
    axios.post("http://localhost:4000/api/startSemester", {
      ...form,
      calendar,
      events
    })
      .then((res) => {
        alert("Semester started successfully!");
        setSemester(res.data.semester);
        setIsSemesterActive(true);
      })
      .catch((err) => console.error("Error starting semester:", err));
  };

  const updateSemester = () => {
    axios.put("http://localhost:4000/api/updateSemester", {
      ...form,
      events,
      calendar: calendar.map(date => ({
        date: date.date,
        description: events[date.date]?.description || "",
        type: events[date.date]?.type || "normal",
      }))
    })
      .then((res) => {
        alert("Semester updated successfully!");
        setSemester(res.data.semester);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating semester:", err));
  };

  const handleEventChange = (date, field, value) => {
    setEvents((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value,
      },
    }));
  };

  const toggleEventType = (date, type) => {
    console.log(type)
    setEvents((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        type:  type || "normal",
      },
    }));
    console.log(events)
  };

  const endSemester = () => {
    const isYearDone = window.confirm("Has one year been completed?");
    axios.post("http://localhost:4000/api/endSemester",{isYearDone})
      .then(() => {
        alert("Semester ended!");
        setIsSemesterActive(false);
        setSemester(null);
      })
      .catch((err) => console.error("Error ending semester:", err));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pt-24 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin - Academic Term Management</h2>

      {!isSemesterActive ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Start New Semester</h3>
          <input type="date" name="startDate" value={form.startDate} onChange={handleInputChange} className="border p-2 mr-2 rounded" />
          <input type="date" name="endDate" value={form.endDate} onChange={handleInputChange} className="border p-2 mr-2 rounded" />
          <button onClick={generateCalendar} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Generate Calendar
          </button>
          <button onClick={startSemester} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600">
            Start Semester
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Semester Details</h3>
          {isEditing ? (
            <>
              <input type="date" name="startDate" value={form.startDate} onChange={handleInputChange} className="border p-2 mr-2 rounded" />
              <input type="date" name="endDate" value={form.endDate} onChange={handleInputChange} className="border p-2 mr-2 rounded" />
              <button onClick={updateSemester} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="ml-2 text-red-500">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Start Date:</strong> {semester?.startDate}</p>
              <p><strong>End Date:</strong> {semester?.endDate}</p>
              <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Edit Semester
              </button>
            </>
          )}
        </div>
      )}

      {calendar.length > 0 && (
        <div className="overflow-auto max-h-96 border p-4">
          <h3 className="text-lg font-semibold mb-2">Academic Calendar</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Date</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Holiday</th>
                <th className="border p-2">Exam</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((dateObj, i) => (
                <tr key={i} className="border">
                  <td className="p-2">{dateObj.date}</td>
                  <td className="p-2">
                    <input type="text" value={events[dateObj.date]?.description || ""} onChange={(e) => handleEventChange(dateObj.date, "description", e.target.value)} className="border p-1 w-full rounded" />
                  </td>
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={events[dateObj.date]?.type === "holiday"} onChange={() => toggleEventType(dateObj.date, "holiday")} />
                  </td>
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={events[dateObj.date]?.type === "exam"} onChange={() => toggleEventType(dateObj.date, "exam")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isSemesterActive && <button onClick={endSemester} className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600">End Semester</button>}
    </div>
  );
};

export default AdminAcademicTerm;
