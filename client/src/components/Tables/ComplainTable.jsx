import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ComplaintTable() {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700">{error}</p>
                <button 
                    onClick={fetchComplaints}
                    className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Complaints Status</h2>
                <button 
                    onClick={fetchComplaints}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                    Refresh
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.subject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="max-w-xs truncate">{complaint.message}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                complaint.status === 'unread'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No complaints found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ComplaintTable;
