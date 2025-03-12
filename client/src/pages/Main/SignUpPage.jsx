import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleStudentSignUp = () => {
    navigate('/signin/student');
  };

  const handleFacultySignUp = () => {
    navigate('/signin/faculty');
  };

  const handleSecretarySignUp = () => {
    navigate('/signin/secretary');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
  <div className="container mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r pb-5 from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6 animate-pulse">
      Welcome to SignUp Portal
    </h1>
    <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
      Create your account and access your personalized profile through our secure portal.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Student Portal */}
      <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
        <div className="mb-4">
          <GraduationCap className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Portal</h2>
        <p className="text-gray-600 mb-4 text-center">
          Access courses, submit assignments, and track your progress.
        </p>
        <button
          onClick={handleStudentSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Student SignUp →
        </button>
      </div>

      {/* Faculty Portal */}
      <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
        <div className="mb-4">
          <BookOpen className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Faculty Portal</h2>
        <p className="text-gray-600 mb-4 text-center">
          Manage content, communicate with students, and access resources.
        </p>
        <button
          onClick={handleFacultySignUp}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Faculty SignUp →
        </button>
      </div>
    </div>
  </div>
</div>);
};

export default SignUpPage;