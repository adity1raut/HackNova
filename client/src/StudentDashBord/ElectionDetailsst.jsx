import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Clock, AlertCircle, Award, RefreshCcw, Image, ChevronDown } from 'lucide-react';

// Function to get status color and icon
const getStatusDetails = (status) => {
  switch (status) {
    case "pending":
      return { color: "bg-yellow-500", icon: <AlertCircle size={16} /> };
    case "approved":
      return { color: "bg-green-500", icon: <Award size={16} /> };
    case "rejected":
      return { color: "bg-red-500", icon: <AlertCircle size={16} /> };
    default:
      return { color: "bg-gray-500", icon: <AlertCircle size={16} /> };
  }
};

// Candidate Card Component
const CandidateCard = ({ candidate }) => {
  const statusDetails = getStatusDetails(candidate.status);

  return (
    <div className="flex border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
      {/* Left Side: Candidate Details */}
      <div className="flex-1 p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center space-x-2 ${statusDetails.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {statusDetails.icon}
            <span>{candidate.status}</span>
          </div>
          <p className="text-sm text-gray-500">
            <Clock size={16} className="inline-block mr-1" />
            {new Date(candidate.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Candidate Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex items-center space-x-2">
            <User className="text-purple-700" size={18} />
            <p className="text-gray-800 font-semibold">
              <span className="font-bold text-purple-700">Name:</span> {candidate.name}
            </p>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <Mail className="text-purple-700" size={18} />
            <p className="text-gray-800 font-semibold">
              <span className="font-bold text-purple-700">Email:</span> {candidate.email}
            </p>
          </div>

          {/* Branch */}
          <div className="flex items-center space-x-2">
            <BookOpen className="text-purple-700" size={18} />
            <p className="text-gray-800 font-semibold">
              <span className="font-bold text-purple-700">Branch:</span> {candidate.branch}
            </p>
          </div>

          {/* Year */}
          <div className="flex items-center space-x-2">
            <Clock className="text-purple-700" size={18} />
            <p className="text-gray-800 font-semibold">
              <span className="font-bold text-purple-700">Year:</span> {candidate.year}
            </p>
          </div>

          {/* Position */}
          <div className="col-span-2 flex items-start space-x-2">
            <Award className="text-purple-700" size={18} />
            <p className="text-gray-800">
              <span className="font-bold text-purple-700">Position:</span> {candidate.position}
            </p>
          </div>

          {/* Profile */}
          {/* <div className="col-span-2 flex items-start space-x-2">
            <User className="text-purple-700" size={18} />
            <p className="text-gray-800">
              <span className="font-bold text-purple-700">Profile:</span>{" "}
              <a
                href={candidate.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Side: Profile Image */}
      <div className="w-48 h-48 flex items-center justify-center p-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {candidate.image ? (
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-100">
              <Image className="text-purple-500" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ElectionDetailsst() {
  const [candidates, setCandidates] = useState([]); // Store all candidates
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [departmentFilter, setDepartmentFilter] = useState(''); // Department filter
  const [statusFilter, setStatusFilter] = useState(''); // Status filter
  const [postFilter, setPostFilter] = useState(''); // Post filter

  // Fetch candidates data from the API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/election-candidates'); // Adjust the URL if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data); // Set the fetched candidates
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates based on selected criteria
  const filteredCandidates = candidates.filter((candidate) => {
    return (
      (departmentFilter === '' || candidate.branch === departmentFilter) &&
      (statusFilter === '' || candidate.status === statusFilter) &&
      (postFilter === '' || candidate.position === postFilter)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchCandidates}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Sorting Dropdowns */}
        <div className="flex justify-end gap-4">
          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="EXTC">EXTC</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="PROD">PROD</option>
              <option value="TEXT">TEXT</option>
              <option value="ELECT">ELECT</option>
              <option value="INSTRU">INSTRU</option>
              <option value="CHEM">CHEM</option>

               </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Post Dropdown */}
          <div className="relative">
            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            >
              <option value="">All Posts</option>
              <option value="technical secretary">Technical Secretary</option>
              <option value="cultural secretary">Cultural Secretary</option>
              <option value="sport secretary">Sport Secretary</option>
              <option value="general secretary">General Secretary</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filtered Candidates */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate, index) => (
            <CandidateCard key={index} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElectionDetailsst;