import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Calendar, FileText, Upload, Book, Clock, Plus, 
  AlertCircle, Check, Edit, Trash2, User, UserCircle,
  FileType, Info, ChevronDown, Award, BookOpen
} from 'lucide-react';

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState(null);
  const [secondFile, setSecondFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [userType, setUserType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    fetchAssignments();

    const storedType = localStorage.getItem('type');
    const storedEmail = localStorage.getItem('email');
    setUserType(storedType);
    setUserEmail(storedEmail);

    if (storedType === 'faculty' && storedEmail) {
      fetchFacultyId(storedEmail);
    }
  }, []);

  const fetchFacultyId = async (email) => {
    // Implementation remains the same
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments.', { position: "top-right", autoClose: 5000 });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSecondFileChange = (e) => {
    setSecondFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (userType !== 'faculty') {
      toast.error('Only faculty can create or update assignments.', { position: "top-right", autoClose: 5000 });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('teacherEmail', userEmail);

    if (file) {
      formData.append('file', file);
    }

    if (secondFile) {
      formData.append('secondFile', secondFile);
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let response;
      if (editingAssignmentId) {
        response = await fetch(`http://localhost:4000/api/assignment/${editingAssignmentId}`, {
          method: 'PUT',
          headers,
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update assignment');
        }

        toast.success('Assignment updated successfully!', { position: "top-right", autoClose: 3000 });
        setEditingAssignmentId(null);
      } else {
        response = await fetch('http://localhost:4000/api/create-assignment', {
          method: 'POST',
          headers,
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create assignment');
        }

        toast.success('Assignment created successfully!', { position: "top-right", autoClose: 3000 });
      }

      resetForm();
      fetchAssignments();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating/updating assignment', error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/assignment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete assignment');
      }

      toast.success('Assignment deleted successfully!', { position: "top-right", autoClose: 3000 });
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      handleApiError(error);
    }
  };

  const handleEdit = (assignment) => {
    if (userType === 'faculty') {
      setEditingAssignmentId(assignment._id);
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(new Date(assignment.dueDate).toISOString().split('T')[0]);
      setSubject(assignment.subject);
      setYear(assignment.year);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Only faculty can edit assignments.', { position: "top-right", autoClose: 5000 });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setSubject('');
    setYear('');
    setFile(null);
    setSecondFile(null);

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => { input.value = ''; });
  };

  const handleApiError = (error) => {
    if (error.response) {
      toast.error(`Error: ${error.response.data.message || 'An error occurred'}`, { position: "top-right", autoClose: 5000 });
    } else if (error.request) {
      toast.error('Server not responding. Please try again later.', { position: "top-right", autoClose: 5000 });
    } else {
      toast.error(`${error.message || 'An unexpected error occurred. Please try again.'}`, { position: "top-right", autoClose: 5000 });
    }
  };

  const getSubjectOptions = () => {
    switch (year) {
      case '1st Year':
        return ['Chemistry', 'Math', 'Physics'];
      case '2nd Year':
        return ['Math 2', 'MI', 'PCC'];
      case '3rd Year':
        return ['MIM', 'PM', 'CMM'];
      case '4th Year':
        return ['Project', 'PM'];
      default:
        return [];
    }
  };

  const getAllSubjects = () => {
    return [
      ...['Chemistry', 'Math', 'Physics'],
      ...['Math 2', 'MI', 'PCC'],
      ...['MIM', 'PM', 'CMM'],
      ...['Project']
    ];
  };

  const getAllYears = () => {
    return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) resetForm();
    else setEditingAssignmentId(null);
  };

  const filterAssignments = () => {
    return assignments.filter(assignment => 
      (filterYear ? assignment.year === filterYear : true) &&
      (filterSubject ? assignment.subject === filterSubject : true)
    );
  };

  const clearFilters = () => {
    setFilterYear('');
    setFilterSubject('');
  };

  const getDueDateStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-700' };
    if (daysUntilDue <= 1) return { status: 'urgent', label: 'Due Today/Tomorrow', color: 'bg-orange-100 text-orange-700' };
    if (daysUntilDue <= 3) return { status: 'upcoming', label: 'Upcoming', color: 'bg-yellow-100 text-yellow-700' };
    return { status: 'future', label: 'Future', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-gradient-to-r  pt-20 py-6 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Assignment Management</h1>
          <div className="flex items-center space-x-3">
            <UserCircle size={20} />
            <span className="font-medium">{userEmail}</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {userType === 'faculty' ? 'Faculty' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-6">
        {/* Faculty Controls */}
        {userType === 'faculty' && (
          <div className="mb-6">
            <button 
              onClick={toggleForm} 
              className={`flex items-center justify-center rounded-md px-4 py-2 font-medium transition duration-200 shadow-md ${showForm ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {showForm ? (
                <>
                  <ChevronDown size={18} className="mr-2" />
                  Hide Form
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  {editingAssignmentId ? 'Edit Assignment' : 'Create New Assignment'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Assignment Form */}
        {userType === 'faculty' && showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              {editingAssignmentId ? (
                <>
                  <Edit size={20} className="mr-2 text-indigo-600" />
                  Edit Assignment
                </>
              ) : (
                <>
                  <Plus size={20} className="mr-2 text-indigo-600" />
                  Create New Assignment
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                    Assignment Title
                  </label>
                  <input 
                    type="text" 
                    id="title" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter assignment title"
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="dueDate">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-indigo-600" />
                      Due Date
                    </div>
                  </label>
                  <input 
                    type="date" 
                    id="dueDate" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="year">
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-1 text-indigo-600" />
                      Year
                    </div>
                  </label>
                  <select 
                    id="year" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" 
                    value={year} 
                    onChange={(e) => { setYear(e.target.value); setSubject(''); }} 
                    required
                  >
                    <option value="">Select Year</option>
                    {getAllYears().map((yearOption, index) => (
                      <option key={index} value={yearOption}>{yearOption}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="subject">
                    <div className="flex items-center">
                      <Book size={16} className="mr-1 text-indigo-600" />
                      Subject
                    </div>
                  </label>
                  <select 
                    id="subject" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                    disabled={!year}
                  >
                    <option value="">Select Subject</option>
                    {getSubjectOptions().map((subjectOption, index) => (
                      <option key={index} value={subjectOption}>{subjectOption}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                  <div className="flex items-center">
                    <Info size={16} className="mr-1 text-indigo-600" />
                    Description
                  </div>
                </label>
                <textarea 
                  id="description" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows="3" 
                  placeholder="Enter detailed instructions for the assignment"
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-1 text-indigo-600" />
                      Assignment File
                    </div>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                    <label 
                      htmlFor="file" 
                      className="flex items-center justify-center w-full py-2 px-4 rounded-md border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
                    >
                      <Upload size={16} className="mr-1 text-indigo-600" />
                      {file ? file.name : 'Choose Assignment File'}
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="secondFile">
                    <div className="flex items-center">
                      <FileType size={16} className="mr-1 text-indigo-600" />
                      Additional File (Optional)
                    </div>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="secondFile" 
                      className="hidden" 
                      onChange={handleSecondFileChange} 
                    />
                    <label 
                      htmlFor="secondFile" 
                      className="flex items-center justify-center w-full py-2 px-4 rounded-md border border-gray-300 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
                    >
                      <Upload size={16} className="mr-1 text-indigo-600" />
                      {secondFile ? secondFile.name : 'Choose Additional File'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                {editingAssignmentId && (
                  <button 
                    type="button" 
                    onClick={() => { resetForm(); setEditingAssignmentId(null); }} 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  type="submit" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      {editingAssignmentId ? 'Update Assignment' : 'Create Assignment'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
              <Award size={20} className="mr-2 text-indigo-600" />
              Assignment List
            </h2>
            <div className="flex flex-wrap gap-3">
              <select 
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border text-sm"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {getAllYears().map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
              <select 
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border text-sm"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {getAllSubjects().map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
              {(filterYear || filterSubject) && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-indigo-600 flex items-center"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No assignments found.</p>
            {userType === 'faculty' && (
              <button 
                onClick={() => setShowForm(true)} 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <Plus size={16} className="mr-2" />
                Create your first assignment
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterAssignments().map(assignment => {
              const dueStatus = getDueDateStatus(assignment.dueDate);
              
              return (
                <div key={assignment._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-lg">
                  <div className="px-6 py-5 border-b border-gray-100">
                    {/* Assignment Header */}
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{assignment.title}</h3>
                      <span className={`${dueStatus.color} text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center`}>
                        <Clock size={12} className="mr-1" />
                        {dueStatus.label}
                      </span>
                    </div>
                    
                    {/* Subject & Year */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Book size={14} className="mr-1 flex-shrink-0" />
                      <span>{assignment.subject} - {assignment.year}</span>
                    </div>
                    
                    {/* Due Date */}
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-1 flex-shrink-0" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  {/* Assignment Body */}
                  <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>
                    
                    {/* Teacher Info */}
                    {assignment.teacher && assignment.teacher.name && (
                      <div className="flex items-center text-gray-500 text-xs mb-4">
                        <User size={12} className="mr-1 flex-shrink-0" />
                        <span>Created by: {assignment.teacher.name}</span>
                      </div>
                    )}
                    
                    {/* Files Section */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assignment.files && assignment.files.length > 0 && (
                        <a 
                          href={`http://localhost:4000${assignment.files[0].url}`}
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FileText size={12} className="mr-1 flex-shrink-0" />
                          Instructions
                        </a>
                      )}
                      {assignment.secondFile && (
                        <a 
                          href={`http://localhost:4000${assignment.secondFile.url}`}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FileText size={12} className="mr-1 flex-shrink-0" />
                          Additional File
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions Footer */}
                  {userType === 'faculty' && (
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2 border-t border-gray-100">
                      <button 
                        onClick={() => handleEdit(assignment)} 
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors p-2 rounded-md"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this assignment?')) {
                            handleDelete(assignment._id);
                          }
                        }}
                        className="bg-red-100 hover:bg-red-200 text-red-700 transition-colors p-2 rounded-md"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* No Results After Filtering */}
        {assignments.length > 0 && filterAssignments().length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
            <AlertCircle size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No assignments match your current filters.</p>
            <button 
              onClick={clearFilters}
              className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;