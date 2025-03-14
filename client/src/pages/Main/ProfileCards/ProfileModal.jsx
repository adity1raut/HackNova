import React from "react";

const ProfileModal = ({ selectedUser, closeModal }) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
        <p>Email: {selectedUser.email}</p>
        <p>Phone: {selectedUser.phone}</p>
        <p>Website: {selectedUser.website}</p>
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;