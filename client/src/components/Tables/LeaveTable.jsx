import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function LeaveTable() {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/leave-applications?page=${page}&limit=10`);
      setApplications(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast('Error fetching leave applications. Please try again.');
    }
  };

  return (
   
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 w-full">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">Leave Applications</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brown-200">
              <thead className="bg-brown-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brown-200">
                {applications.map((application, index) => (
                  <tr key={index} className="hover:bg-brown-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-700">{application.student_information.roll_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-700">{application.student_information.student_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-700">{new Date(application.leave_details.leave_start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-700">{new Date(application.leave_details.leave_end_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-brown-700">
                      <div className="max-w-xs truncate">{application.leave_details.reason_for_leave}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t border-brown-200 pt-4">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-brown-300 rounded-md text-sm font-medium text-brown-700 bg-white hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-brown-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-brown-300 rounded-md text-sm font-medium text-brown-700 bg-white hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
     
  );
}

export default LeaveTable;
