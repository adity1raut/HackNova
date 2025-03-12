import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  FileText,
  MessageSquare,
  DollarSign,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [electionData, setElectionData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [complaintData, setComplaintData] = useState(null);
  const [facultyAvailability, setFacultyAvailability] = useState({
    available: 0,
    unavailable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch booking data
        const bookingResponse = await fetch(
          "http://localhost:4000/api/bookings/data"
        );
        const bookingData = await bookingResponse.json();
        setBookingData(bookingData);

        // Fetch leave application data
        const leaveResponse = await axios.get(
          "http://localhost:4000/api/leave-applications?page=1&limit=10"
        );
        setLeaveData(leaveResponse.data);

        // Fetch complaint data
        const complaintResponse = await fetch(
          "http://localhost:4000/api/complaints/users"
        );
        const complaintData = await complaintResponse.json();
        setComplaintData(complaintData);

        // Fetch faculty availability data
        const facultyResponse = await axios.get(
          "http://localhost:4000/api/faculty-availability"
        );
        setFacultyAvailability(facultyResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-20 gap-6">
        {/* Timetable Card */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              View Timetable
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Total Candidates:</span>
              <span className="ml-2 font-medium text-gray-800">
                {electionData?.length || 0}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/election-details")}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md transition-all duration-300"
          >
            View Timetable
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              View Assignment
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-2 font-medium text-gray-800">
                {facultyAvailability.available}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Unavailable:</span>
              <span className="ml-2 font-medium text-gray-800">
                {facultyAvailability.unavailable}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/assignment")}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>

        {/* Sponsorship & Budgets Card */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Total Budget:</span>
              <span className="ml-2 font-medium text-gray-800">$20,000</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Expenses:</span>
              <span className="ml-2 font-medium text-gray-800">$15,000</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/notice")}
            className="w-full py-2 px-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Facility Booking
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Booked Facilities:</span>
              <span className="ml-2 font-medium text-gray-800">
                {bookingData?.booked?.length || 0}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Available Facilities:</span>
              <span className="ml-2 font-medium text-gray-800">
                {bookingData?.available?.length || 0}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/booking-details")}
            className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>

        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Applications
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-medium text-gray-800">
                {leaveData?.pending || 0}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Approved:</span>
              <span className="ml-2 font-medium text-gray-800">
                {leaveData?.approved || 0}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/leave-details")}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>

        {/* Faculty Availability Card */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Faculty Availability
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-2 font-medium text-gray-800">
                {facultyAvailability.available}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Unavailable:</span>
              <span className="ml-2 font-medium text-gray-800">
                {facultyAvailability.unavailable}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/faculty-details")}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>

        {/* Event Schedules Card */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Event Schedules
            </h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-2 font-medium text-gray-800">All Events</span>
            </div>
            <div className="flex items-center">
              <span className="ml-2 font-medium text-gray-800">
                Past Events
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/event/student")}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-md transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
