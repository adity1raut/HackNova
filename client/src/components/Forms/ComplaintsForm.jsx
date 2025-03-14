import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, MessageSquare, Send } from 'lucide-react';
import ComplainTable from '../Tables/ComplainTable';

const ComplaintsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        status: 'unread'
    });
    const [complaints, setComplaints] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting complaint...', {
            position: "top-right",
            theme: "light"
        });

        try {
            const response = await fetch('http://localhost:4000/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to submit complaint');
            
            const newComplaint = await response.json();
            setComplaints(prev => [...prev, newComplaint]);

            toast.update(loadingToast, {
                render: "Complaint submitted successfully! 🎉",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                status: 'unread'
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: "Failed to submit complaint! Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white";
    const labelClassName = "flex items-center gap-2 text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Complaints Management
                </h1>

                <div className="flex flex-col  items-center gap-8 justify-center">
                    {/* Form Section */}
                    <div className="w-full lg:w-[600px]">
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 sticky top-8">
                            <div className="space-y-5">
                                <div>
                                    <label className={labelClassName}>
                                        <User size={16} /> Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClassName}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClassName}>
                                        <Mail size={16} /> Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={inputClassName}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className={labelClassName}>
                                        <MessageSquare size={16} /> Subject<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={inputClassName}
                                        placeholder="Enter complaint subject"
                                    />
                                </div>

                                <div>
                                    <label className={labelClassName}>
                                        <MessageSquare size={16} /> Message<span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className={`${inputClassName} resize-none`}
                                        placeholder="Describe your complaint..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </form>
                    </div>


                    <div className="w-full lg:w-[1000px]">
                        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Previous Complaints</h2>
                            <ComplainTable />
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ComplaintsForm;