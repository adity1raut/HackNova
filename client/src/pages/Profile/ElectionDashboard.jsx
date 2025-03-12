import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ElectionDashboard = () => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    votedCount: 0,
    remainingVoters: 0
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    votedUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats from the backend
        const response = await fetch('http://localhost:4000/api/user-stats'); // Replace with your backend URL
        const data = await response.json();
        setUserStats(data);

        // Update the existing stats based on the fetched data
        setStats(prevState => ({
          ...prevState,
          totalVoters: data.totalUsers,
          votedCount: data.votedUsers,
          remainingVoters: data.totalUsers - data.votedUsers,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const votedPercentage = ((stats.votedCount / stats.totalVoters) * 100).toFixed(1);
  const remainingPercentage = ((stats.remainingVoters / stats.totalVoters) * 100).toFixed(1);

  // Data for Pie Chart
  const pieData = [
    { name: 'Voted', value: stats.votedCount },
    { name: 'Remaining', value: stats.remainingVoters }
  ];

  // Data for Bar Chart
  const barData = [
    { name: 'Total Voters', value: stats.totalVoters },
    { name: 'Voted', value: stats.votedCount },
    { name: 'Remaining', value: stats.remainingVoters }
  ];

  const COLORS = ['#22c55e', '#f97316'];

  return (
    <div className="w-full  min-h-screen bg-gradient-to-b from-blue-50 to-white p-2 pt-20 sm:p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center py-3 sm:py-4 mb-4 sm:mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300 mx-2 sm:mx-0">
        Election Statistics
      </h2>
      
      {/* Original Cards Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-2 sm:px-0 mb-6">
        {/* Total Voters Card */}
        <div className="w-full lg:flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-blue-100 h-auto sm:h-80 lg:h-96">
          <div className="mb-4 sm:mb-6 lg:mb-8 bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium flex items-center gap-3">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-500 animate-pulse" />
              Total Voters
            </h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-blue-50 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-blue-600 mb-3 sm:mb-4 lg:mb-6 animate-bounce">
              {stats.totalVoters.toLocaleString()}
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center">Registered voters in the system</p>
          </div>
        </div>

        {/* Voted Count Card */}
        <div className="w-full lg:flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-green-100 h-auto sm:h-80 lg:h-96">
          <div className="mb-4 sm:mb-6 lg:mb-8 bg-green-50 p-3 sm:p-4 lg:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium flex items-center gap-3">
              <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-500 animate-pulse" />
              Votes Cast
            </h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-green-50 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-green-600 mb-3 sm:mb-4 lg:mb-6 animate-bounce">
              {stats.votedCount.toLocaleString()}
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 text-center">
              {votedPercentage}% of total voters
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 lg:h-5 p-1 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 lg:h-3 rounded-full transform origin-left transition-all duration-1000"
                style={{ width: `${votedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Remaining Voters Card */}
        <div className="w-full lg:flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-orange-100 h-auto sm:h-80 lg:h-96">
          <div className="mb-4 sm:mb-6 lg:mb-8 bg-orange-50 p-3 sm:p-4 lg:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium flex items-center gap-3">
              <UserX className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-orange-500 animate-pulse" />
              Remaining Voters
            </h3>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-orange-50 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-orange-600 mb-3 sm:mb-4 lg:mb-6 animate-bounce">
              {stats.remainingVoters.toLocaleString()}
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 text-center">
              {remainingPercentage}% of total voters
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 lg:h-5 p-1 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 lg:h-3 rounded-full transform origin-left transition-all duration-1000"
                style={{ width: `${remainingPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 sm:px-0 mb-6">
        {/* Pie Chart */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-blue-100">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Voting Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Voted</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Remaining</span>
            </div>
          </div>
        </div>... {/* Bar Chart */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-blue-100">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Voter Statistics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#4b5563' }}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <YAxis 
                  tick={{ fill: '#4b5563' }}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDashboard;
