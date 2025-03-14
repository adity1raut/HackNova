  import React, { useState, useEffect } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { MessageSquare, Calendar, Vote, Stethoscope ,Clipboard , Info} from 'lucide-react';
  import axios from 'axios';
  import Card from "../../components/Other/Card";

  // EditProfileModal component remains the same as before
  const EditProfileModal = ({ isOpen, onClose, studentInfo, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      branch: '',
      rollno: '',
      profile: null,
      year: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      if (studentInfo) {
        setFormData({
          name: studentInfo.name || '',
          email: studentInfo.email || '',
          branch: studentInfo.branch || '',
          rollno: studentInfo.rollno || '',
          year: studentInfo.year || '',
          profile: null
        });
      }
    }, [studentInfo]);

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files) {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('branch', formData.branch);
        formDataToSend.append('rollno', formData.rollno);
        formDataToSend.append('year', formData.year);
        if (formData.profile) {
          formDataToSend.append('profileImage', formData.profile);
        }

        await onUpdate(formDataToSend);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profile"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Academic Year</option>
                  <option value="FE">1st Year</option>
                  <option value="SE">2nd Year</option>
                  <option value="TE">3rd Year</option>
                  <option value="BE">4th Year</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <select
                  name="branch"
                  aria-placeholder='Branch'
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {/* <option value="">Select Branch</option> */}
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="EnTC">EnTC</option>
                  <option value="EE">EE</option>
                  <option value="ME">ME</option>
                  <option value="CE">Civil</option>
                  <option value="PRODUCTION">PRODUCTION</option>
                  <option value="TEXTILE">TEXTILE</option>
                  <option value="INSTRU">INSTRU</option>
                  {/* <option value="CE">Civil</option>  */}
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll No
                </label>
                <input
                  type="text"
                  name="rollno"
                  value={formData.rollno}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ProfilePagesss = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        console.log('email: ' + email);
        console.log('token: ' + token);

        if (!token || !email) {
          navigate('/login');
          return;
        }
      

        const response = await axios.get(`http://localhost:4000/api/profile/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.data) {
          setStudentInfo(response.data.data);
        }

        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch profile data');
        }
        setLoading(false);
      }
    };

    const handleUpdateProfile = async (formData) => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        const response = await axios.put(
          `http://localhost:4000/api/profile/${email}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          await fetchProfile();
        }
      } catch (error) {
        throw error;
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('rollNumber');
      navigate('/login');
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-green-500 p-8 flex items-center justify-center">
          <p className="text-white text-xl">Loading profile data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-green-500 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-red-600 text-xl font-bold mb-4">Error Loading Profile</h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-green-200 p-4 pt-24 md:p-8">
        <div className="max-w-5xl pt-20 mx-auto">
          <h1 className="text-3xl md:text-4xl text-purple-600 text-center font-bold mb-2">
            Student Profile
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Profile Card */}
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="flex flex-col items-center p-6">
                <div className="relative group">
                  <img
                    src={studentInfo?.profile || '/api/placeholder/128/128'}
                    alt="profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 object-cover ring-4 ring-purple-100 transition-all duration-300 hover:ring-purple-300"
                  />
                </div>

                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {studentInfo?.name || 'N/A'}
                </h2>

                <div className="space-y-3 w-full text-gray-600">
                  <p className="flex justify-between">
                    <span className="font-medium">Roll Number:</span>
                    <span>{studentInfo?.rollno || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-sm">{studentInfo?.email || 'N/A'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Branch:</span>
                    <span>{studentInfo?.branch || 'N/A'}</span>
                  </p>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </Card>

            {/* Information Cards */}
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
              <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center">
                    <Info size={24} color="gray" className="mr-2" />
                    General Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ['Roll Number', studentInfo?.rollno],
                      ['Email', studentInfo?.email],
                      ['Branch', studentInfo?.branch],
                      ['Type', studentInfo?.type],
                      ['Academic Year', studentInfo?.year]
                    ].map(([key, value]) => (
                      <div key={key} className="border-b border-gray-100 py-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">{key}</span>
                          <span className="text-gray-800">: {value || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

      <div className="bg-white shadow-lg rounded-xl">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <a href="/student/leave-application" className="w-full">
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <Calendar size={20} />
                Leave Application
              </button>
            </a>
            
            <a href="/student/attendence" className="w-full">
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <Vote size={20} />
                Attendance
              </button>
            </a>
            
            <a href="/dashboard/assignment" className="w-full">
        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2">
          <Clipboard size={20} />
          View Assignment
        </button>
      </a>
          </div>
        </div>
      </div>

            </div>
          </div>

          {isEditModalOpen && (
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              studentInfo={studentInfo}
              onUpdate={handleUpdateProfile}
            />
          )}
        </div>
      </div>
    );
  };

  export default ProfilePagesss;