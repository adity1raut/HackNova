import React, { useState } from "react";
import { Mail, Lock, Key, RotateCw, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgetPassForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [step, setStep] = useState(1); // 1: Forgot Password, 2: Verify OTP, 3: Reset Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(""); // Clear error when user types
    };

    const validateFields = () => {
        const { email, otp, newPassword, confirmPassword } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (step === 1) {
            if (!email || !emailRegex.test(email)) {
                setError("Please enter a valid email address");
                return false;
            }
        }

        if (step === 2) {
            if (!otp || otp.length !== 4 || !/^\d+$/.test(otp)) {
                setError("Please enter a valid 4-digit OTP");
                return false;
            }
        }

        if (step === 3) {
            if (!newPassword || newPassword.length < 6) {
                setError("Password must be at least 6 characters long");
                return false;
            }
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let response;
            let requestBody;

            if (step === 1) {
                requestBody = { email: formData.email };
                response = await fetch("http://localhost:4000/api/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });
            } else if (step === 2) {
                requestBody = {
                    email: formData.email,
                    otp: formData.otp.toString(), // Ensure OTP is sent as a string
                };
                response = await fetch("http://localhost:4000/api/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });
            } else if (step === 3) {
                requestBody = {
                    email: formData.email,
                    newPassword: formData.newPassword,
                };
                response = await fetch("http://localhost:4000/api/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess(data.message);

            if (step === 1) {
                setStep(2); // Move to Verify OTP step
            } else if (step === 2) {
                setStep(3); // Move to Reset Password step
            } else if (step === 3) {
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login after successful reset
                }, 2000);
            }
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:4000/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to resend OTP");
            }

            setSuccess("New OTP sent to your email!");
            setFormData((prev) => ({ ...prev, otp: "" })); // Clear OTP field
        } catch (err) {
            setError(err.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-blue-50 rounded-full mb-4">
                        <Key className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>

                    <div className="flex justify-center space-x-2 mb-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                    step >= i ? "bg-blue-600" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm">
                        {step === 1 && "Enter your email to receive an OTP"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Create your new password"}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CheckCircle2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    maxLength={4}
                                    pattern="\d{4}"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter 4-digit OTP"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                Resend OTP
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter new password"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Confirm new password"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <RotateCw className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/login"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassForm;