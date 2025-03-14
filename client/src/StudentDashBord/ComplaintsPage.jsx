import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, AlertCircle, MessageSquare, Clock, RefreshCcw, Loader2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:4000/api/complaints/users');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setError('Failed to load complaints');
            toast.error(error.message || 'Error fetching complaints', {
                position: "top-right",
                theme: "light",
                style: {
                    background: '#FFF5F5',
                    color: '#E53E3E',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const getStatusColor = (status) => {
        return status === 'unread' 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-500">Loading complaints...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white">
                    <div className="flex items-center justify-center min-h-[200px]">
                        <div className="text-center text-red-600">
                            <p>{error}</p>
                            <button 
                                onClick={fetchComplaints}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RefreshCcw size={16} />
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Complaints Status</h2>
                    <button 
                        onClick={fetchComplaints}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        <RefreshCcw size={16} />
                        Refresh
                    </button>
                </div>

                <div className="space-y-4">
                    {complaints.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No complaints found
                        </div>
                    ) : (
                        complaints.map((complaint) => (
                            <div 
                                key={complaint._id}
                                className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
                            >
                                {/* Status and Date Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`flex items-center space-x-2 ${getStatusColor(complaint.status)} px-3 py-1 rounded-full text-sm font-semibold`}>
                                        <AlertCircle size={16} />
                                        <span>{complaint.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        <Clock size={16} className="inline-block mr-1" />
                                        {new Date(complaint.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {/* Complaint Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    {/* <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gray-100 rounded-full">
                                            <User className="text-purple-700" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Name</p>
                                            <p className="text-gray-900 font-semibold">{complaint.name}</p>
                                        </div>
                                    </div> */}

                                    {/* Email */}
                                    {/* <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gray-100 rounded-full">
                                            <Mail className="text-purple-700" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-gray-900 font-semibold">{complaint.email}</p>
                                        </div>
                                    </div> */}

                                    {/* Subject */}
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gray-100 rounded-full">
                                            <AlertCircle className="text-purple-700" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Subject</p>
                                            <p className="text-gray-900 font-semibold">{complaint.subject}</p>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-gray-100 rounded-full">
                                                <MessageSquare className="text-purple-700" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                                                <p className="text-gray-900">{complaint.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComplaintPage;