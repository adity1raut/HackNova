import React, { useState, useEffect } from "react";

const EditProfileModal = ({ isOpen, onClose, studentInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    rollno: "",
    profile: null,
    year: "",
  });

  useEffect(() => {
    if (studentInfo) {
      setFormData({
        name: studentInfo.name || "",
        email: studentInfo.email || "",
        branch: studentInfo.branch || "",
        rollno: studentInfo.rollno || "",
        year: studentInfo.year || "",
        profile: null,
      });
    }
  }, [studentInfo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }
      await onUpdate(formDataToSend);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" name="profile" onChange={handleChange} accept="image/*" />
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Academic Year" required />
          <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" required />
          <input type="text" name="rollno" value={formData.rollno} onChange={handleChange} placeholder="Roll No" required />
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
