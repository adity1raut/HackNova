import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProfileModal from './ProfileCards/EditProfileModa'
import ProfileCard from "./ProfileCards/ProfileCard";
import ProfileActions from "./ProfileCards/ProfileActions";
import ProfileInfo from "./ProfileCards/ProfileInfo";

const ProfilePage = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!token || !email) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/profile/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentInfo(response.data.data);
    } catch {
      navigate("/login");
    }
  };

  const handleUpdateProfile = async (formData) => {
    await axios.put(`http://localhost:4000/api/profile/${studentInfo.email}`, formData);
    fetchProfile();
  };

  return (
    <div className="p-8">
      <ProfileCard studentInfo={studentInfo} onEdit={() => setIsEditModalOpen(true)} onLogout={() => navigate("/login")} />
      <ProfileInfo studentInfo={studentInfo} />
      <ProfileActions />
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} studentInfo={studentInfo} onUpdate={handleUpdateProfile} />
    </div>
  );
};

export default ProfilePage;
