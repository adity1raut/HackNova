import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000"); // Backend URL

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState(null);

  useEffect(() => {
    // Fetch assignments initially
    axios.get("http://localhost:4000/api/assignments")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));

    // Listen for new assignment notifications
    socket.on("new-assignment", (assignment) => {
      setNewAssignment(assignment);
      setAssignments((prev) => [assignment, ...prev]); // Add new assignment to the list
    });

    return () => {
      socket.off("new-assignment");
    };
  }, []);

  return (
    <div>
      <h2>Assignments</h2>

      {newAssignment && (
        <div className="notification">
          🆕 New Assignment: {newAssignment.title}
        </div>
      )}

      <ul>
        {assignments.map((a) => (
          <li key={a.id}>{a.title} - {a.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;
