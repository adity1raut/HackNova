import React from "react";
import { MessageSquare, Calendar, Vote } from "lucide-react";

const ProfileActions = () => {
  const actions = [
    { icon: <MessageSquare size={20} />, text: "Complaints", link: "/student/complaints" },
    { icon: <Calendar size={20} />, text: "Leave Application", link: "/student/leave-application" },
    { icon: <Vote size={20} />, text: "Election Application", link: "/student/election-form" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map(({ icon, text, link }, idx) => (
        <a key={idx} href={link} className="w-full">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {icon} {text}
          </button>
        </a>
      ))}
    </div>
  );
};

export default ProfileActions;
