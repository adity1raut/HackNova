import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Clock, Calendar, Loader2, RefreshCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const LeaveApplication = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `http://localhost:4000/api/leave-applications?page=${page}&limit=10`
      );
      
      setApplications(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch leave applications');
      toast.error('Error fetching leave applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get status icon and color
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { icon: <CheckCircle size={20} className="text-green-600" />, color: "bg-green-100" };
      case "rejected":
        return { icon: <XCircle size={20} className="text-red-600" />, color: "bg-red-100" };
      case "pending":
        return { icon: <AlertCircle size={20} className="text-yellow-600" />, color: "bg-yellow-100" };
      default:
        return { icon: <AlertCircle size={20} className="text-gray-600" />, color: "bg-gray-100" };
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button 
                onClick={fetchApplications}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading leave applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pt-20 min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Leave Applications
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              <Clock size={16} className="inline-block mr-1" />
              {new Date().toLocaleDateString()}
            </p>
            <button
              onClick={fetchApplications}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No leave applications found
            </div>
          ) : (
            applications.map((application, index) => {
              const statusDetails = getStatusDetails(application.status);
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Section: Student Details */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Student Name */}
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <User className="text-purple-700" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Student Name
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {application.student_information.student_name}
                            </p>
                          </div>
                        </div>

                        {/* Roll Number */}
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Clock className="text-purple-700" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Roll Number
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {application.student_information.roll_no}
                            </p>
                          </div>
                        </div>

                        {/* Start Date */}
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Calendar className="text-purple-700" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Start Date
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {new Date(
                                application.leave_details.leave_start_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Calendar className="text-purple-700" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              End Date
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {new Date(
                                application.leave_details.leave_end_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mt-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Clock className="text-purple-700" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Reason
                            </p>
                            <p className="text-gray-900">
                              {application.leave_details.reason_for_leave}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Status */}
                    <div className="col-span-1 flex items-center justify-end">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 ${statusDetails.color} rounded-full`}>
                          {statusDetails.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Status
                          </p>
                          <p className="text-gray-900 font-semibold capitalize">
                            {application.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {applications.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next 
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;