import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  BookOpen, 
  ChevronDown, 
  Bell, 
  User, 
  LogIn, 
  Menu, 
  X, 
  Home, 
  Settings, 
  HelpCircle, 
  FileText,
  Users,
  LogOut,
  Clipboard,
  Calendar,
  UserCircle,
  BookMarked,
  GraduationCap,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import logo from "../../assets/sggs_logo-removebg-preview.png";

const EnhancedNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');

  // Dummy notifications data
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: "Assignment Update",
      message: "Your recent assignment has been graded.",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Sunday from 2-4 AM.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      title: "New Announcement",
      message: "Important announcement regarding upcoming examinations.",
      time: "1 day ago",
      read: false
    }
  ]);

  useEffect(() => {
    setActiveRoute(location.pathname);
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
      if (notificationDropdownOpen && !event.target.closest('.notification-container')) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen, notificationDropdownOpen]);

  // Update unread notification count
  useEffect(() => {
    const unreadCount = notificationsList.filter(notification => !notification.read).length;
    setNotifications(unreadCount);
  }, [notificationsList]);

  const toggleDropdown = (name) => {
    if (dropdownOpen === name) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(name);
    }
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDropdownOpen(null);
    setNotificationDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('type');
    localStorage.removeItem('email');
    navigate("/login");
  };

  const markNotificationAsRead = (notificationId) => {
    setNotificationsList(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotificationsList(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  // Determine profile link and role based on user email and type
  const userType = localStorage.getItem("type") || "";
  const isStudent = user?.email?.match(/^[0-9]{4}[a-zA-Z]{3}[0-9]{3}@sggs.ac.in$/);

  // Set profile link based on user type
  const profileLink = userType === 'admin' 
    ? '/admin/profile' 
    : isStudent 
    ? '/student/profile' 
    : '/faculty/profile';
    
  // Set dashboard link based on user type
  const dashboardLink = isStudent 
    ? '/dashboard' 
    : userType === 'admin'
    ? '/admin/dashboard'
    : '/faculty/dashboard';

  // Student menu items
  const studentItems = [
    { 
      icon: <GraduationCap size={16} />, 
      name: 'Student Dashboard', 
      description: 'Access your personalized student dashboard',
      path: '/dashboard'
    },
    { 
      icon: <GraduationCap size={16} />, 
      name: 'Calender', 
      description: 'Access your Calender',
      path: '/calender'
    },
    { 
      icon: <FileText size={16} />, 
      name: 'Assignments', 
      description: 'View and submit assignments',
      path: '/dashboard/assignment'
    },
    { 
      icon: <Calendar size={16} />, 
      name: 'Schedule', 
      description: 'View class schedule and exams',
      path: '/student/schedule'
    },
    { 
      icon: <GraduationCap size={16} />, 
      name: 'Shedular', 
      description: 'Access your Calender',
      path: '/time-scheduler'
    },
    { 
      icon: <ClipboardList size={16} />, 
      name: 'Faculty Schedule', 
      description: 'View your academic performance',
      path: '/dashboard/faculty-details'
    }
  ];

  // Faculty menu items
  const facultyItems = [
    { 
      icon: <UserCheck size={16} />, 
      name: 'Faculty Dashboard', 
      description: 'Access your faculty control panel',
      path: '/faculty/dashboard'
    },
    { 
      icon: <FileText size={16} />, 
      name: 'Assignments', 
      description: 'Create and grade assignments',
      path: '/faculty/dashboard/assignment'
    },
    { 
      icon: <GraduationCap size={16} />, 
      name: 'Calender', 
      description: 'Access your Calender',
      path: '/calender'
    },
    { 
      icon: <ClipboardList size={16} />, 
      name: 'Grade Management', 
      description: 'Manage student grades',
      path: '/faculty/dashboard/grade'
    }
  ];

  // Admin menu items
  const adminItems = [
    { 
      icon: <Clipboard size={16} />, 
      name: 'Admin Dashboard', 
      description: 'Manage college system',
      path: '/admin/dashboard'
    },
    { 
      icon: <Users size={16} />, 
      name: 'User Management', 
      description: 'Manage students and faculty',
      path: '/admin/users'
    },
    { 
      icon: <BookMarked size={16} />, 
      name: 'Course Management', 
      description: 'Manage college courses',
      path: '/admin/courses'
    },
    { 
      icon: <Settings size={16} />, 
      name: 'System Settings', 
      description: 'Configure system parameters',
      path: '/admin/settings'
    }
  ];

  // Get appropriate menu items based on user type
  const getMenuItems = () => {
    if (userType === 'admin') return adminItems;
    if (isStudent) return studentItems;
    return facultyItems; // Default to faculty
  };

  // Nav button with active state styling
  const NavLink = ({ path, children, className = "", isLogout = false }) => {
    const isActive = activeRoute === path;
    
    return (
      <button
        onClick={isLogout ? handleLogout : () => handleNavigation(path)}
        className={`flex items-center text-sm font-medium px-2 py-1 rounded-md transition-colors duration-200 relative ${
          isActive 
            ? 'text-blue-600' 
            : isLogout
              ? 'text-red-500 hover:text-red-700'
              : 'text-gray-600 hover:text-blue-600'
        } ${className}`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform"></span>
        )}
      </button>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={() => handleNavigation('/')} className="flex items-center focus:outline-none">
                <div className={`relative overflow-hidden transition-all duration-300 ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`}>
                  <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div className="ml-3">
                  <span className={`font-bold transition-all duration-300 ${scrolled ? 'text-xl text-gray-800' : 'text-2xl text-blue-600'}`}>XYZ College</span>
                  <div className={`text-xs text-gray-500 transition-opacity duration-300 ${scrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>College Management System</div>
                </div>
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {!isAuthenticated ? (
                <>
                  <NavLink path="/signin">
                    <User size={16} className="mr-1" />
                    Signup
                  </NavLink>
                  <NavLink path="/forgot-password">
                    <HelpCircle size={16} className="mr-1" />
                    Forgot Password
                  </NavLink>
                </>
              ) : (
                <>
                  {/* Dashboard Link - Now routes to specific dashboard */}
                  <NavLink path={dashboardLink}>
                    <Home size={16} className="mr-1" />
                    Dashboard
                  </NavLink>

                  {/* User-specific Dropdown */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => toggleDropdown('userMenu')}
                      className={`flex items-center text-sm font-medium px-2 py-1 rounded-md transition-colors duration-200 ${dropdownOpen === 'userMenu' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      {userType === 'admin' ? 'Admin' : isStudent ? 'Student' : 'Faculty'}
                      <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${dropdownOpen === 'userMenu' ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownOpen === 'userMenu' && (
                      <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100 transform transition-all duration-200 origin-top-left">
                        <div className="p-2">
                          {getMenuItems().map((item, index) => (
                            <button 
                              key={index} 
                              onClick={() => handleNavigation(item.path)} 
                              className="flex w-full p-3 hover:bg-blue-50 rounded-lg transition-colors duration-150 text-left"
                            >
                              <div className="text-blue-500">{item.icon}</div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <NavLink path="/logout" isLogout={true} className="text-red-500 hover:text-red-700">
                    <LogOut size={16} className="mr-1" />
                    Logout
                  </NavLink>
                </>
              )}
            </div>

            {/* Right Actions for authenticated users */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                {/* Notification Bell with Dropdown */}
                <div className="relative notification-container">
                  <button 
                    onClick={toggleNotificationDropdown} 
                    className="p-1 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notifications}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {notificationDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100">
                      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notificationsList.length > 0 ? (
                          notificationsList.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm text-gray-800">{notification.title}</h4>
                                <button 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {!notification.read && (
                                  <button 
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No notifications
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-gray-100">
                        <button 
                          onClick={() => handleNavigation('/notifications')}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 p-2"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="border-l pl-4 border-gray-200">
                  <button 
                    onClick={() => handleNavigation(profileLink)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    <User size={16} className="mr-2" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* Login Button for non-authenticated users */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center">
                <button 
                  onClick={() => handleNavigation('/login')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                >
                  <LogIn size={16} className="mr-2" />
                  <span>Login</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-bold text-lg">XYZ College</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="py-2 px-4">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('/login')} 
                  className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <LogIn size={18} className="mr-3" />
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/signin')} 
                  className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <User size={18} className="mr-3" />
                  Signup
                </button>
                <button 
                  onClick={() => handleNavigation('/forgot-password')} 
                  className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <HelpCircle size={18} className="mr-3" />
                  Forgot Password
                </button>
              </>
            ) : (
              <>
                {/* Dashboard Link - Now routes to specific dashboard */}
                <button 
                  onClick={() => handleNavigation(dashboardLink)} 
                  className={`flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 ${
                    activeRoute === dashboardLink ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Home size={18} className="mr-3" />
                  Dashboard
                </button>

                {/* Mobile Notifications */}
                <div className="w-full">
                  <div className="border-t border-b border-gray-100 py-2 my-2">
                    <h3 className="px-4 font-medium text-sm text-gray-700 mb-1">Notifications</h3>
                    
                    {notificationsList.length > 0 ? (
                      <div className="max-h-52 overflow-y-auto">
                        {notificationsList.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-2 border-l-2 mb-1 ${notification.read ? 'border-transparent' : 'border-blue-500'}`}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <button 
                                onClick={() => markNotificationAsRead(notification.id)}
                                className={`text-xs ${notification.read ? 'text-gray-400' : 'text-blue-600'}`}
                              >
                                {notification.read ? '' : 'Mark read'}
                              </button>
                            </div>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
                    )}
                    
                    <div className="px-4 pt-2 flex justify-between">
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600"
                      >
                        Mark all as read
                      </button>
                      <button 
                        onClick={() => handleNavigation('/notifications')}
                        className="text-xs text-blue-600"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display menu items based on user type */}
                {getMenuItems().map((item, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleNavigation(item.path)} 
                    className={`flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 ${
                      activeRoute === item.path ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.name}
                  </button>
                ))}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="border-t mt-2 pt-4 px-6">
              <button 
                onClick={() => handleNavigation('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                <LogIn size={18} className="mr-2" />
                Login / Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EnhancedNavbar;