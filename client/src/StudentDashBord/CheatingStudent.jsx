import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, User, Mail, Flag, Clock, Image, RefreshCw } from 'lucide-react';

function CheatingStudent() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page for pagination
  const itemsPerPage = 10; // Number of items to display per page

  // Fetch reports from the API
  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/cheating');
      setReports(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    fetchReports();
  };

  // Calculate the reports to display for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedReports = reports.slice(startIndex, endIndex);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-gray-600 text-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="mr-2"
        >
          <AlertCircle size={24} />
        </motion.div>
        Loading...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-red-500 text-lg"
      >
        <AlertCircle size={24} className="mr-2" />
        Error: {error}
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl pt-20 mx-auto p-6 font-sans">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          Cheating Reports
        </motion.h1>
        <button
          onClick={handleRefresh}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={18} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Reports List */}
      <ul className="space-y-4">
        {displayedReports.map((report, index) => (
          <motion.li
            key={report._id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-blue-600 flex items-center">
              <User size={20} className="mr-2" />
              {report.name}
            </h2>
            <p className="mt-2 text-gray-700 flex items-center">
              <Flag size={16} className="mr-2" />
              <strong>Reason:</strong> {report.reason}
            </p>
            {/* <p className="text-gray-700 flex items-center">
              <Mail size={16} className="mr-2" />
              <strong>Email:</strong> {report.email}
            </p> */}
            <p className="text-gray-700 flex items-center">
              <User size={16} className="mr-2" />
              <strong>Reported By:</strong> {report.reportedBy}
            </p>
            <p className="text-gray-700 flex items-center">
              <Image size={16} className="mr-2" />
              <strong>Proof:</strong>{' '}
              <a
                href={report.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Image
              </a>
            </p>
            <p className="text-gray-700 flex items-center">
              <User size={16} className="mr-2" />
              <strong>Action Tacken:</strong> {report.action}
            </p>
            
            {/* <p className="text-gray-700 flex items-center">
              <Clock size={16} className="mr-2" />
              <strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}
            </p> */}
          </motion.li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={endIndex >= reports.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CheatingStudent;