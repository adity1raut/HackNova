import React from 'react';
import { User, Calendar, FileText, MessageSquare, DollarSign, Users, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-20 gap-6">
        {/* Elections Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Update TimeTable</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">
                Information related to the different issues of the college and their overview released by the administration.
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/timetable')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Add Acadamic Calendar</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">
                Information related to the different issues of the college and their overview released by the administration.
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/term')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>
        {/* Facility Booking Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Facility Booking</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Displays the current status of the different fascilities of the institute.</span>

            </div>

          </div>
          <button
            onClick={() => navigate('/admin/dashboard/booking')}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>

        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
          </div>
          <div className="space-y-2 mb-6">
            <span className="text-gray-600">Here are the different applications related with the issues such as Events,budgets,etc. </span>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/leaves')}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>

        {/* Complaints Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Complaints</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">here are the complaints posted by college peoples . complaints Management of a students</span>
            </div>

          </div>
          <button
            onClick={() => navigate('/admin/dashboard/complaints')}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-800">Add Notification</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">
                Information related to the different issues of the college and their overview released by the administration.
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/notices')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      </div>
      {/* <ElectionDashboard/> */}
    </div>
  );
};

export default AdminDashboardPage;