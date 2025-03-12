import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  User,
  Building2,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const FacultySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "admin"
  });

  const [otpForm, setOtpForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOtpFormChange = (e) => {
    const { name, value } = e.target;
    setOtpForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateInitialForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email || !formData.email.endsWith("@sggs.ac.in")) {
      newErrors.email = "Please use a valid SGGS email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    // Basic password validation
    if (!otpForm.password || otpForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (otpForm.password !== otpForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateInitialForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/faculty/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully to your email!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || "Failed to send OTP", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Handle specific field errors
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/faculty/verify-and-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: otpForm.otp,
            password: otpForm.password,
            confirmPassword: otpForm.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            navigate('/login');
          }
        });
      } else {
        toast.error(data.message || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred during registration", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/faculty/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("New OTP sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || "Failed to resend OTP", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred while resending OTP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Faculty Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Register with your SGGS email
          </p>
        </div>

        {!otpSent ? (
          // Initial Registration Form
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="mr-2 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 pl-10 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Mail className="mr-2 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 pl-10 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="username@sggs.ac.in"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <UserCheck className="mr-2 text-gray-400" />
                Account Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.type ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="faculty">....</option>
                <option value="faculty">faculty</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? <RefreshCw className="mr-2 animate-spin" /> : null}
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otpForm.otp}
                onChange={handleOtpFormChange}
                maxLength="6"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.otp ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter 6-digit OTP"
                required
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
              )}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center"
              >
                <RefreshCw className="mr-1" size={16} />
                Resend OTP
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Set Password
              </label>
              <input
                type="password"
                name="password"
                value={otpForm.password}
                onChange={handleOtpFormChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter password"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={otpForm.confirmPassword}
                onChange={handleOtpFormChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Re-enter password"
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? <RefreshCw className="mr-2 animate-spin" /> : null}
              {loading ? "Processing..." : "Register"}
              </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>



  );  
  }

export default FacultySignup;