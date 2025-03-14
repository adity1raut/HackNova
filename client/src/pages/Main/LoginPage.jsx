import React from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import SplitText from "../SplitText/SplitText";

const LoginPortal = () => {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-15 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto">
        {/* Welcome Text with Animation */}
        <SplitText
          text="Welcome to the Login Portal"
          className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6"
          delay={70} // Slower for better visibility
          animationFrom={{ opacity: 0, transform: "translate3d(-50px,0,0)" }} // Smooth Left to Right
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.3}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />

        <p className="text-gray-700 text-lg mb-8 text-center max-w-xl mx-auto">
          Access your profile securely and manage your academic activities with ease.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Student Portal */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <GraduationCap className="h-14 w-14 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Student Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Access courses, submit assignments, and track progress.
            </p>
            <button
              onClick={() => navigate("/login/student")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Student Login →
            </button>
          </div>

          {/* Faculty Portal */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <BookOpen className="h-14 w-14 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Faculty Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Manage content, communicate with students, and access resources.
            </p>
            <button
              onClick={() => navigate("/login/faculty")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Faculty Login →
            </button>
          </div>

          {/* Admin Portal */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-14 w-14 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Admin Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Manage user accounts, configure settings, and monitor performance.
            </p>
            <button
              onClick={() => navigate("/login/admin")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Admin Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPortal;
