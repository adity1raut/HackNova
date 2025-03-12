import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfileCard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/faculty/profile/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.data) {
          setUserData(response.data.data);
        } else {
          setError("No data found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  const { avatar, name, email: userEmail } = userData;

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[320px] flex flex-col items-center text-center">
        
        {/* Avatar Section */}
        <figure className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden mb-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </figure>

        {/* User Name */}
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{name}</h2>

        {/* Email */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Admin</span>
          <span className="text-sm">{userEmail}</span>
        </div>

        {/* Edit Profile Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default AdminProfileCard;