import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Bell, FileText, Award, LogIn } from 'lucide-react';
import login from './LoginPage.jsx'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { 
      icon: <Users size={48} className="text-blue-500" />, 
      title: "Role-Based Access", 
      description: "Separate secure portals for students, faculty, and administrators" 
    },
    { 
      icon: <Calendar size={48} className="text-green-500" />, 
      title: "Attendance Tracking", 
      description: "Real-time attendance management with automated reports" 
    },
    { 
      icon: <FileText size={48} className="text-purple-500" />, 
      title: "Assignment Management", 
      description: "Submit, grade, and track assignments with ease" 
    },
    { 
      icon: <Bell size={48} className="text-red-500" />, 
      title: "Notice Board", 
      description: "Important announcements and updates in one place" 
    },
    { 
      icon: <Award size={48} className="text-yellow-500" />, 
      title: "Grade Tracking", 
      description: "Comprehensive grade management and performance analytics" 
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">EduManage Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                <LogIn size={16} className="mr-2" /> Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Revolutionize Your <span className="text-blue-600">College Management</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              A comprehensive solution for students, faculty, and administrators to streamline college operations and enhance communication.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <a href='login'>Get Started</a>
              </button>
              {/* <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300">
                Learn More
              </button> */}
            </div>
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border-4 border-blue-100">
                <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium">Student Dashboard</div>
                  <div className="w-6"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Welcome back,</div>
                        <div className="font-medium">Alex Johnson</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">Sem 6 - CSE</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100 flex items-center">
                      <Calendar size={18} className="text-green-600" />
                      <span className="ml-2 text-sm text-gray-700">Attendance: <span className="font-medium text-green-600">92%</span></span>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-center">
                      <FileText size={18} className="text-purple-600" />
                      <span className="ml-2 text-sm text-gray-700">Pending Assignments: <span className="font-medium text-purple-600">2</span></span>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-center">
                      <Award size={18} className="text-yellow-600" />
                      <span className="ml-2 text-sm text-gray-700">Current GPA: <span className="font-medium text-yellow-600">3.8</span></span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Bell size={16} className="text-red-500" />
                      <span className="ml-2 font-medium">Latest Notices</span>
                    </div>
                    <div className="text-sm text-gray-600 pl-6">
                      <div className="mb-1">• Mid-term exam schedule released</div>
                      <div>• Campus festival on 15th March</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to manage your college effectively</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl shadow-md border-2 transition-all duration-500 ${activeFeature === index ? 'border-blue-500 transform scale-105' : 'border-gray-100'}`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Sections */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Tailored For Everyone</h2>
            <p className="mt-4 text-xl text-gray-600">Specific portals designed for different roles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
              <div className="h-2 bg-blue-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Students</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                    <span>View and track attendance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                    <span>Submit assignments</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                    <span>Check grades and progress</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                    <span>Receive important notifications</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
              <div className="h-2 bg-green-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-600 mb-4">Faculty</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                    <span>Manage class attendance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                    <span>Create and grade assignments</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                    <span>Post announcements</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-green-600 rounded-full mr-2"></div>
                    <span>Track student performance</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
              <div className="h-2 bg-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-600 mb-4">Administrators</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                    <span>Manage student and faculty records</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                    <span>Generate comprehensive reports</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                    <span>Configure system settings</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                    <span>Oversee all college operations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default HomePage;