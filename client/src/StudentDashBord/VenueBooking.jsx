import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Clock, MapPin, MessageSquare, AlertCircle, Check, X, RefreshCcw } from "lucide-react";

const VenueBooking = () => {
  const [bookings, setBookings] = useState([]); // Store all bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booking data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:4000/api/bookings/data");
      if (!response.ok) {
        throw new Error("Failed to fetch booking data");
      }
      const data = await response.json();
      if (data.length > 0) {
        setBookings(data); // Set all bookings
      } else {
        setError("No bookings found");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setError("Failed to fetch booking data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to get status color and icon
  const getStatusDetails = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-500", icon: <AlertCircle size={16} /> };
      case "confirmed":
        return { color: "bg-green-500", icon: <Check size={16} /> };
      case "cancelled":
        return { color: "bg-red-500", icon: <X size={16} /> };
      default:
        return { color: "bg-gray-500", icon: <AlertCircle size={16} /> };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-6xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-6xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCcw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Venue Booking Details</h2>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {/* Display All Bookings */}
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            const statusDetails = getStatusDetails(booking.status);
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center space-x-2 ${statusDetails.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {statusDetails.icon}
                    <span>{booking.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    <Calendar size={16} className="inline-block mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="flex items-center space-x-2">
                    <User className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Name:</span> {booking.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-2">
                    <Mail className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Email:</span> {booking.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-2">
                    <Phone className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Phone:</span> {booking.phone}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Date:</span> {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center space-x-2">
                    <Clock className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Time:</span> {new Date(booking.time).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-purple-700" size={16} />
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold text-purple-700">Location:</span> {booking.venue}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <div className="flex items-start space-x-2">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <MessageSquare className="text-purple-700" size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                        <p className="text-gray-800">{booking.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VenueBooking;