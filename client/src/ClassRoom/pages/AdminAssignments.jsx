import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Users, 
  CheckSquare, 
  Clock, 
  Filter, 
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle,
  HourglassIcon,
  Download,
  Eye,
  Edit,
  X,
  RefreshCw,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  // State for submissions list
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    assignmentId: '',
    startDate: '',
    endDate: ''
  });
  
  // State for selected submission to grade
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: '',
    status: 'graded'
  });

  // Fetch submissions and statistics on component mount
  useEffect(() => {
    fetchSubmissions();
    fetchStatistics();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { status, assignmentId, startDate, endDate } = filters;
      
      let url = '/api/admin/submissions?';
      if (status) url += `status=${status}&`;
      if (assignmentId) url += `assignmentId=${assignmentId}&`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}&`;
      
      const response = await axios.get(url);
      setSubmissions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/admin/statistics');
      setStatistics(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchSubmissions();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      assignmentId: '',
      startDate: '',
      endDate: ''
    });
    // Fetch all submissions
    fetchSubmissions();
  };

  // Open grade dialog
  const openGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade || '',
      feedback: submission.feedback || '',
      status: submission.status || 'graded'
    });
    setGradeDialogOpen(true);
  };

  // Handle form input changes
  const handleGradeFormChange = (e) => {
    const { name, value } = e.target;
    setGradeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit grade and feedback
  const submitGrade = async () => {
    try {
      await axios.put(`/api/admin/submissions/${selectedSubmission._id}`, gradeForm);
      // Refresh submissions list
      fetchSubmissions();
      // Close dialog
      setGradeDialogOpen(false);
      // Update statistics
      fetchStatistics();
    } catch (err) {
      console.error('Error updating submission:', err);
      alert('Failed to update submission');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status icon and color
  const getStatusDetails = (status) => {
    switch(status) {
      case 'submitted':
        return { 
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />, 
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Submitted'
        };
      case 'graded':
        return { 
          icon: <CheckCircle className="w-5 h-5 text-green-500" />, 
          color: 'bg-green-100 text-green-800',
          text: 'Graded'
        };
      case 'in-progress':
        return { 
          icon: <HourglassIcon className="w-5 h-5 text-blue-500" />, 
          color: 'bg-blue-100 text-blue-800',
          text: 'In Progress'
        };
      default:
        return { 
          icon: <HourglassIcon className="w-5 h-5 text-gray-500" />, 
          color: 'bg-gray-100 text-gray-800',
          text: status || 'Unknown'
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <BookOpen className="mr-2 w-8 h-8 text-blue-600" />
        Assignment Management Dashboard
      </h1>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-blue-100 mb-3">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Total Assignments</h2>
            <p className="text-3xl font-bold text-blue-600">{statistics.totalAssignments}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-green-100 mb-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Total Submissions</h2>
            <p className="text-3xl font-bold text-green-600">{statistics.totalSubmissions}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-yellow-100 mb-3">
              <CheckSquare className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Pending Review</h2>
            <p className="text-3xl font-bold text-yellow-600">{statistics.submissionsByStatus.submitted}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-purple-100 mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Recent Submissions</h2>
            <p className="text-3xl font-bold text-purple-600">{statistics.recentSubmissions}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Filter className="mr-2 w-5 h-5 text-gray-600" />
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment ID</label>
            <input
              type="text"
              name="assignmentId"
              value={filters.assignmentId}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              onClick={applyFilters}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              <Search className="w-4 h-4 mr-1" />
              Filter
            </button>
            <button 
              onClick={resetFilters}
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 w-5 h-5 text-gray-600" />
          Student Submissions
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
            <p className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => {
                    const statusDetails = getStatusDetails(submission.status);
                    
                    return (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {submission.assignment ? submission.assignment.title : 'Unknown Assignment'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(submission.submissionDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex items-center text-xs font-medium rounded-full ${statusDetails.color}`}>
                            {statusDetails.icon}
                            <span className="ml-1">{statusDetails.text}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.grade || 'Not graded'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openGradeDialog(submission)}
                            className="inline-flex items-center mr-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            {submission.status === 'graded' ? 'Update' : 'Grade'}
                          </button>
                          <a 
                            href={submission.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Dialog */}
      {gradeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">Grade Submission</h3>
              <button 
                onClick={() => setGradeDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedSubmission && (
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500 mb-4">
                  Student: <span className="font-medium">{selectedSubmission.email}</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input
                      type="text"
                      name="grade"
                      value={gradeForm.grade}
                      onChange={handleGradeFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter grade"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={gradeForm.status}
                      onChange={handleGradeFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="graded">Graded</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea
                    name="feedback"
                    value={gradeForm.feedback}
                    onChange={handleGradeFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter feedback for the student"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 border-t pt-4">
                  <button 
                    onClick={() => setGradeDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitGrade}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;