import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    email: "",
    type: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateFields = () => {
    const { name, rollno, email, password, confirmPassword } = formData;
    const emailPattern = /@sggs\.ac\.in$/;
    const rollnoPattern = /^\d{4}[a-zA-Z]{3}\d{3}$/;

    if (!name || !rollno || !email) {
      toast.error("All fields are required.");
      return false;
    }

    if (!emailPattern.test(email)) {
      toast.error("Please use your SGGS email address.");
      return false;
    }

    if (!rollnoPattern.test(rollno)) {
      toast.error("Invalid roll number format (YYYYXXXNNN).");
      return false;
    }

    if (otpSent) {
      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return false;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords don't match.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);

    try {
      if (!otpSent) {
        const response = await axios.post("http://localhost:4000/api/send-otp", {
          email: formData.email,
          name: formData.name,
          rollno: formData.rollno,
        });
        if (response.status === 200) {
          setOtpSent(true);
          toast.success("OTP sent to your email!");
        }
      } else {
        const response = await axios.post("http://localhost:4000/api/users", {
          ...formData
        });
        if (response.status === 201) {
          toast.success("Account created successfully!");
          setTimeout(() => {
            navigate("/login"); // Navigate to login page after 2 seconds
          }, 2000);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Please fill in your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2024XXX012"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">College Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@sggs.ac.in"
            />
          </div>

          {otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter OTP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : otpSent ? 'Create Account' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentSignUp;