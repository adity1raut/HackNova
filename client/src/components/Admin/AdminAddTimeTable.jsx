import React, { useState, useEffect } from "react";
import axios from "axios";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const years = ["First", "Second", "Third", "Fourth"];
const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const semesters = ["First", "Second"];

const AdminManageTimeTable = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState(null);
  const [editableTimetable, setEditableTimetable] = useState(null);
  const [showTimetablePage, setShowTimetablePage] = useState(false);
  const [searchParams, setSearchParams] = useState({
    year: "",
    department: "",
    semester: "",
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/get-timetable");
      setTimetables(response.data);
    } catch (error) {
      console.error("Error fetching timetables:", error);
    }
  };

  const handleSearch = () => {
    const result = timetables.filter(
      (tt) =>
        (!searchParams.year || tt.year === searchParams.year.toLowerCase()) &&
        (!searchParams.department || tt.department === searchParams.department) &&
        (!searchParams.semester || tt.semester === searchParams.semester.toLowerCase())
    );
    console.log("Filtered Data:", result);
    setFilteredTimetable(result);
    setEditableTimetable(null);  // Only update the search results
  };
  
  
  

  const handleEdit = async (updatedTimetable) => {
    try {
      await axios.put(`http://localhost:4000/api/edit-timetable`, updatedTimetable);
      alert("Timetable updated successfully!");
      fetchTimetables();
    } catch (error) {
      console.error("Error updating timetable:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 p-24 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Timetables</h2>

      {/* Search Section */}
      <div className="grid grid-cols-4 gap-4">
        <select
          name="year"
          value={searchParams.year}
          onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year.toLowerCase()}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="department"
          value={searchParams.department}
          onChange={(e) => setSearchParams({ ...searchParams, department: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          name="semester"
          value={searchParams.semester}
          onChange={(e) => setSearchParams({ ...searchParams, semester: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem.toLowerCase()}>
              {sem}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Display All Timetables */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">All Timetables</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Semester</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {(filteredTimetable ?? timetables).map((tt, index) => (  // Ensure it's an array
    <tr key={index} className="text-center">
      <td className="border px-4 py-2">{tt.year?.toUpperCase()}</td>
      <td className="border px-4 py-2">{tt.department}</td>
      <td className="border px-4 py-2">{tt.semester?.toUpperCase()}</td>
      <td className="border px-4 py-2">
      <button
  onClick={() => {setEditableTimetable(tt);
  setShowTimetablePage(false);}
    // Show the edit form
  }
  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
>
  Edit
</button>

      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Add New Timetable Button */}
      <button
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
  onClick={() => setShowTimetablePage((prev) => !prev)}
>
  Add New Timetable
</button>


      {/* Display Timetable for Editing */}
     {!showTimetablePage &&editableTimetable && <TimetableForm timetable={editableTimetable} onSave={handleEdit} />}
   {showTimetablePage && <TimetablePage />}
     

    </div>
  );
};

// **Timetable Editing Form**
const TimetableForm = ({ timetable, onSave }) => {
    if (!timetable) return <p className="text-red-500">No timetable selected</p>;
  
    // Initialize with a deep copy of the timetable
    const [editableTimetable, setEditableTimetable] = useState({ ...timetable });

    useEffect(() => {
      setEditableTimetable({ ...timetable }); // Update form when timetable changes
    }, [timetable]);
  
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  
    // Ensure the timetable structure is correct
    useEffect(() => {
      setEditableTimetable((prev) => ({
        ...prev,
        ...Object.fromEntries(days.map((day) => [day, prev[day] || []])) // Ensure arrays exist for each day
      }));
    }, [timetable]);
  
    // Function to handle slot changes
    const handleSlotChange = (day, index, field, value) => {
      setEditableTimetable((prev) => {
        const updatedDay = [...prev[day]];
        updatedDay[index] = { ...updatedDay[index], [field]: value };
        return { ...prev, [day]: updatedDay };
      });
    };
  
    // Function to add a new slot
    const addSlot = (day) => {
      setEditableTimetable((prev) => ({
        ...prev,
        [day]: [...prev[day], { subject: "", faculty: "", facultyEmail: "", time: "" }]
      }));
    };
  
    // Function to remove a slot
    const removeSlot = (day, index) => {
      setEditableTimetable((prev) => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index)
      }));
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`/api/edit-timetable`, editableTimetable);
        onSave(editableTimetable); // Update parent state
      } catch (error) {
        console.error("Error updating timetable:", error);
      }
    };
  
    return (
      <div className="mt-6 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold">
          Edit Timetable for {timetable.year?.toUpperCase()} - {timetable.department} - Semester {timetable.semester}
        </h3>
  
        <label className="block mt-4">
          <span className="text-gray-700">Select Semester:</span>
          <select
            value={editableTimetable.semester}
            onChange={(e) => setEditableTimetable((prev) => ({ ...prev, semester: e.target.value }))}
            className="p-2 border rounded w-full"
          >
            <option value="first">First</option>
            <option value="second">Second</option>
          </select>
        </label>
  
        <form onSubmit={handleSubmit}>
          {days.map((day) => (
            <div key={day} className="mt-4">
              <h4 className="text-lg font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
  
              {(editableTimetable[day] || []).map((slot, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mt-2 items-center">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={slot.subject}
                    onChange={(e) => handleSlotChange(day, index, "subject", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Faculty Name"
                    value={slot.faculty}
                    onChange={(e) => handleSlotChange(day, index, "faculty", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="email"
                    placeholder="Faculty Email"
                    value={slot.facultyEmail}
                    onChange={(e) => handleSlotChange(day, index, "facultyEmail", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 10:00 AM)"
                    value={slot.time}
                    onChange={(e) => handleSlotChange(day, index, "time", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(day, index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
  
              <button
                type="button"
                onClick={() => addSlot(day)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add Slot
              </button>
            </div>
          ))}
  
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Save Changes
          </button>
        </form>
      </div>
    );
  };
  
  const TimetablePage = () => {
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");
    const [editableTimetable, setEditableTimetable] = useState({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    });
  
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  
    const handleSlotChange = (day, index, field, value) => {
      setEditableTimetable((prev) => {
        const updatedDay = [...prev[day]];
        updatedDay[index] = { ...updatedDay[index], [field]: value };
        return { ...prev, [day]: updatedDay };
      });
    };
  
    const addSlot = (day) => {
      setEditableTimetable((prev) => ({
        ...prev,
        [day]: [...prev[day], { subject: "", faculty: "", facultyEmail: "", time: "" }],
      }));
    };
  
    const removeSlot = (day, index) => {
      setEditableTimetable((prev) => ({
        ...prev,
        [day]: prev[day].filter((_, i) => i !== index),
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const payload = {
        year,
        department,
        semester,
        timetable: editableTimetable,
      };
  
      try {
        const response = await axios.post("http://localhost:4000/api/add-timetable", payload);
        console.log("Timetable saved:", response.data);
        alert("Timetable saved successfully!");
      } catch (error) {
        console.error("Error saving timetable:", error);
        alert("Failed to save timetable.");
      }
    };
  
    return (
      <div className="mt-6 p-4 border rounded-lg">
        <h3 className="text-xl font-semibold">Add New Timetable</h3>
        <label>
          <span className="text-gray-700">Select Year:</span>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded w-full">
            <option value="">Select Year</option>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
            <option value="fourth">Fourth</option>
          </select>
        </label>
  
        <label className="block mt-4">
          <span className="text-gray-700">Select Department:</span>
          {/* <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 border rounded w-full" placeholder="Enter Department" /> */}
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 border rounded w-full">
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>
        </label>
  
        <label className="block mt-4">
          <span className="text-gray-700">Select Semester:</span>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className="p-2 border rounded w-full">
            <option value="">Select Semester</option>
            <option value="first">1</option>
            <option value="second">2</option>
          </select>
        </label>
  
        <form onSubmit={handleSubmit}>
          {days.map((day) => (
            <div key={day} className="mt-4">
              <h4 className="text-lg font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              {editableTimetable[day].map((slot, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mt-2 items-center">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={slot.subject}
                    onChange={(e) => handleSlotChange(day, index, "subject", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Faculty Name"
                    value={slot.faculty}
                    onChange={(e) => handleSlotChange(day, index, "faculty", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="email"
                    placeholder="Faculty Email"
                    value={slot.facultyEmail}
                    onChange={(e) => handleSlotChange(day, index, "facultyEmail", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 10:00 AM)"
                    value={slot.time}
                    onChange={(e) => handleSlotChange(day, index, "time", e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <button type="button" onClick={() => removeSlot(day, index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addSlot(day)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Add Slot</button>
            </div>
          ))}
  
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Save Changes</button>
        </form>
      </div>
    );
  };
  
  

export default AdminManageTimeTable;
