import React, { useEffect, useState } from "react";
import axios from "axios";

const MakingAttendance = () => {
  const facultyEmail = localStorage.getItem("email");
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [markedStudents, setMarkedStudents] = useState(new Set());

  // Function to get a unique key for storage
  const getAttendanceKey = (facultyEmail, subject, timeSlot) => {
    return `attendance_${facultyEmail}_${subject}_${timeSlot}`;
  };

  // Load marked attendance for the current subject & time slot
  const loadMarkedAttendance = (facultyEmail, subject, timeSlot) => {
    const key = getAttendanceKey(facultyEmail, subject, timeSlot);
    const storedData = localStorage.getItem(key);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = Date.now();

      // Expire attendance after 1 hour
      if (parsedData.timestamp && currentTime - parsedData.timestamp < 3600000) {
        setMarkedStudents(new Set(parsedData.students));
      } else {
        localStorage.removeItem(key);
      }
    }
  };

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`http://localhost:4000/api/faculty/profile/${facultyEmail}`)
        .then((response) => {
          setFacultyInfo(response.data.data);
          return response.data;
        })
        .then((faculty) => {
          return axios.get(
            `http://localhost:4000/api/getCurrentLecture/${faculty.data.department}/${faculty.data.email}`
          );
        })
        .then((response) => {
          setSubject(response.data.lecture.subject);
          setTimeSlot(response.data.lecture.time); 
          setStudents(response.data.students);

          // Load attendance only for the current lecture
          loadMarkedAttendance(facultyEmail, response.data.lecture.subject, response.data.lecture.time);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [facultyEmail]);

  const markAttendance = (studentEmail, isPresent, year) => {
    axios
      .post("/api/makeStudentAbsentOrPresent", {
        studentEmail,
        subject,
        isPresent,
        facultyEmail,
        year,
      })
      .then(() => {
        alert(`Attendance marked for ${studentEmail}`);

        setMarkedStudents((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.add(studentEmail);

          // Save to localStorage with the correct key
          const key = getAttendanceKey(facultyEmail, subject, timeSlot);
          localStorage.setItem(
            key,
            JSON.stringify({ students: Array.from(updatedSet), timestamp: Date.now() })
          );

          return updatedSet;
        });
      })
      .catch((error) => {
        console.error("Error marking attendance:", error);
      });
  };

  return (
    <div className="flex flex-col pt-20 items-center p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Mark Attendance
      </h2>
      {facultyInfo && (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Faculty: <span className="font-bold">{facultyInfo.name}</span> (
            {facultyInfo.email})
          </h3>
          <p className="text-gray-600">Subject: {subject}</p>
          <p className="text-gray-600">Time Slot: {timeSlot}</p>
          <p className="text-gray-600">Department: {facultyInfo.department}</p>
        </div>
      )}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4">
        {students.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li
                key={student.email}
                className="flex justify-between items-center py-3"
              >
                <span className="text-gray-700 font-medium">
                  {student.name} ({student.email})
                </span>
                <button
                  onClick={() => markAttendance(student.email, true, student.year)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    markedStudents.has(student.email)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                  disabled={markedStudents.has(student.email)}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(student.email, false, student.year)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    markedStudents.has(student.email)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  disabled={markedStudents.has(student.email)}
                >
                  Absent
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default MakingAttendance;
