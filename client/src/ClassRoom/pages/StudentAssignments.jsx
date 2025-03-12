import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, UploadCloud, ArrowLeft, Loader2, AlertTriangle, BookOpen, Calendar, FilePlus, Download, ChevronDown, Info } from 'lucide-react';
import AssignmentCard from './components/AssignmentCard';
import AvailableAssignmentCard from './components/AvailableAssignmentCard';
import UploadForm from './components/UploadForm';

const StudentAssignments = () => {
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('mySubmissions');
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem('email');
        const submissionsResponse = await fetch(`http://localhost:4000/api/studentAssignments?email=${email}`);
        const submissionsData = await submissionsResponse.json();
        setStudentAssignments(submissionsData);

        const availableResponse = await fetch('http://localhost:4000/api/assignments/available');
        const availableData = await availableResponse.json();
        setAvailableAssignments(availableData);

        setError('');
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    if (message.includes('Error') || message.includes('Please select')) {
      setMessage('');
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !selectedAssignment) {
      setMessage('Please select an assignment and upload a file.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('feedback', feedback);
    formData.append('assignmentId', selectedAssignment);
    
    // Add email to the form data
    const email = localStorage.getItem('email');
    formData.append('email', email);

    try {
      const response = await fetch('http://localhost:4000/api/studentAssignments/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage('Assignment submitted successfully!');

      setTimeout(() => {
        setActiveTab('mySubmissions');
        setFile(null);
        setFeedback('');
        setSelectedAssignment('');
        setMessage('');
      }, 3000);

      // Update to include email in the request
      const submissionsResponse = await fetch(`http://localhost:4000/api/studentAssignments?email=${email}`);
      const submissionsData = await submissionsResponse.json();
      setStudentAssignments(submissionsData);

      const availableResponse = await fetch('http://localhost:4000/api/assignments/available');
      const availableData = await availableResponse.json();
      setAvailableAssignments(availableData);
    } catch (error) {
      setMessage('Error submitting the assignment. Please try again.');
      console.error('Error uploading assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center font-medium">
            <AlertCircle className="w-3 h-3 mr-1" /> Submitted
          </span>
        );
      case 'graded':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center font-medium">
            <CheckCircle className="w-3 h-3 mr-1" /> Graded
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center font-medium">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
        );
    }
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;

    if (diffTime <= 0) {
      return (
        <span className="text-red-500 flex items-center font-medium">
          <AlertTriangle className="w-4 h-4 mr-1" /> Past due
        </span>
      );
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return (
        <span className="text-green-600 flex items-center font-medium">
          <Clock className="w-4 h-4 mr-1" /> {diffDays} days, {diffHours} hours left
        </span>
      );
    } else if (diffHours > 5) {
      return (
        <span className="text-orange-500 flex items-center font-medium">
          <Clock className="w-4 h-4 mr-1" /> {diffHours} hours left
        </span>
      );
    } else {
      return (
        <span className="text-red-500 flex items-center font-medium">
          <AlertTriangle className="w-4 h-4 mr-1" /> {diffHours} hours left - Submit soon!
        </span>
      );
    }
  };

  const toggleSubmissionDetails = (id) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  if (loading && studentAssignments.length === 0 && availableAssignments.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-semibold mb-6">Your Assignments</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
        <BookOpen className="w-7 h-7 mr-2 text-blue-500" /> Your Assignments
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center rounded">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 
          <span>{error}</span>
          <button 
            onClick={() => setError('')} 
            className="ml-auto text-red-500 hover:text-red-700"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <div className="mb-6 bg-white rounded-lg shadow">
        <nav className="flex p-1">
          <button
            onClick={() => setActiveTab('mySubmissions')}
            className={`py-3 px-4 ${
              activeTab === 'mySubmissions'
                ? 'bg-blue-50 text-blue-600 font-medium rounded-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg'
            } flex-1 flex justify-center items-center text-sm transition-colors`}
          >
            <FileText className="w-4 h-4 mr-2" /> My Submissions
          </button>
          <button
            onClick={() => setActiveTab('submitNew')}
            className={`py-3 px-4 ${
              activeTab === 'submitNew'
                ? 'bg-blue-50 text-blue-600 font-medium rounded-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg'
            } flex-1 flex justify-center items-center text-sm transition-colors`}
          >
            <FilePlus className="w-4 h-4 mr-2" /> New Submission
          </button>
        </nav>
      </div>

      {activeTab === 'mySubmissions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Submissions</h2>
            {studentAssignments.length > 0 && (
              <span className="text-sm text-gray-500">
                {studentAssignments.length} {studentAssignments.length === 1 ? 'assignment' : 'assignments'}
              </span>
            )}
          </div>

          {studentAssignments.length > 0 ? (
            <div className="space-y-4">
              {studentAssignments.map((submission) => (
                <AssignmentCard
                  key={submission._id}
                  submission={submission}
                  expandedSubmission={expandedSubmission}
                  toggleSubmissionDetails={toggleSubmissionDetails}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center border border-gray-200 shadow-sm">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">You haven't submitted any assignments yet.</p>
              <button
                onClick={() => setActiveTab('submitNew')}
                className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 inline-flex items-center text-sm"
              >
                <FilePlus className="w-4 h-4 mr-2" /> Submit New Assignment
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'submitNew' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Assignments</h2>
            {availableAssignments.length > 0 && (
              <span className="text-sm text-gray-500">
                {availableAssignments.length} {availableAssignments.length === 1 ? 'assignment' : 'assignments'} available
              </span>
            )}
          </div>

          {availableAssignments.length > 0 ? (
            <div className="space-y-4">
              {availableAssignments.map((assignment) => (
                <AvailableAssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  setSelectedAssignment={setSelectedAssignment}
                  setActiveTab={setActiveTab}
                  getTimeRemaining={getTimeRemaining}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center border border-gray-200 shadow-sm">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No assignments are currently available for submission.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for new assignments.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'uploadForm' && (
        <UploadForm
          selectedAssignment={selectedAssignment}
          setActiveTab={setActiveTab}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          handleFeedbackChange={handleFeedbackChange}
          file={file}
          feedback={feedback}
          loading={loading}
          message={message}
        />
      )}
    </div>
  );
};

export default StudentAssignments;