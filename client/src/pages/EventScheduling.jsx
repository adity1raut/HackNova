import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import StudentDashboard from './student/StudentDashboard';
import FacultyDashboard from './faculty/FacultyDashboard';

const ProtectedRoute = ({ children, allowedUserType }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to={`/${userType ? userType : 'login'}/dashboard`} />;
  }

  return children;
};

const EventScheduling = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  return (
    <>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedUserType="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />  
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedUserType="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={token ? <Navigate to={`/${userType}/dashboard`} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default EventScheduling;
