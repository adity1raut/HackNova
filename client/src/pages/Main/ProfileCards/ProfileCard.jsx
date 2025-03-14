import React from "react";

const ProfileCard = ({ studentInfo, onEdit, onLogout }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
      <img src={studentInfo?.profile || "/api/placeholder/128/128"} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      <h2 className="text-xl font-bold mb-2">{studentInfo?.name || "N/A"}</h2>
      <p className="text-gray-600">{studentInfo?.email || "N/A"}</p>
      <div className="mt-4 flex flex-col gap-2">
        <button onClick={onEdit} className="bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</button>
        <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
};

export default ProfileCard;
