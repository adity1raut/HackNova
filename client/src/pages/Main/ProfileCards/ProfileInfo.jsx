import React from "react";
import { Info } from "lucide-react";

const ProfileInfo = ({ studentInfo }) => {
  const details = [
    ["Roll Number", studentInfo?.rollno],
    ["Email", studentInfo?.email],
    ["Branch", studentInfo?.branch],
    ["Type", studentInfo?.type],
    ["Academic Year", studentInfo?.year],
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <Info size={24} className="mr-2" /> General Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map(([label, value]) => (
          <p key={label} className="border-b pb-2 flex justify-between">
            <span className="font-medium">{label}</span>
            <span>: {value || "N/A"}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
