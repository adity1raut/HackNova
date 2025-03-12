import React, { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminComplaintsDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });
    const [adminRemarks, setAdminRemarks] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const statuses = ["unread", "approved", "rejected"];

    useEffect(() => {
        fetchComplaints();
    }, [filters]);

    const fetchComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, value]) => value)
            );
            const response = await fetch(`http://localhost:4000/api/complaints?${queryParams}`);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            setComplaints(data.data || []); // Ensure we always set an array
        } catch (error) {
            setError(error.message || 'Error fetching complaints');
            toast.error(error.message || 'Error fetching complaints');
            setComplaints([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/api/complaints/${complaintId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    remarks: adminRemarks.trim() || undefined
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            toast.success(`Complaint ${newStatus} successfully`);
            setSelectedComplaint(null);
            setAdminRemarks('');
            fetchComplaints();
        } catch (error) {
            toast.error(error.message || `Error updating complaint status`);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            case 'unread': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Complaints Management</h1>
                
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg pl-10"
                                    placeholder="Search by name, email, or subject..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaints Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Complaint Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            Loading complaints...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-red-600">
                                            {error}
                                        </td>
                                    </tr>
                                ) : complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            No complaints found
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.map((complaint) => (
                                        <tr key={complaint._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {complaint.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {complaint.email}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    Subject: {complaint.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md">
                                                    {complaint.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {complaint.status === 'unread' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setSelectedComplaint(complaint)}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-200"
                                                        >
                                                            Review
                                                        </button>
                                                    </div>
                                                )}
                                                {complaint.remarks && (
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        Remarks: {complaint.remarks}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status Update Modal */}
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-lg w-full p-6">
                            <h3 className="text-lg font-bold mb-4">Review Complaint</h3>
                            
                            <div className="mb-4">
                                <p className="font-medium">Complaint Details:</p>
                                <p>Name: {selectedComplaint.name}</p>
                                <p>Email: {selectedComplaint.email}</p>
                                <p>Subject: {selectedComplaint.subject}</p>
                                <p className="mt-2">Message:</p>
                                <p className="bg-gray-50 p-3 rounded-lg">{selectedComplaint.message}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Remarks
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-lg"
                                    rows="3"
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    placeholder="Add your remarks about this complaint..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedComplaint._id, 'rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedComplaint._id, 'approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                >
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminComplaintsDashboard;