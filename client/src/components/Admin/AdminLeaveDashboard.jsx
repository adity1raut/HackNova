import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Check, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLeaveDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [adminRemarks, setAdminRemarks] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);

    const statuses = ["pending", "approved", "rejected"];

    useEffect(() => {
        fetchApplications();
    }, [filters]);

    const fetchApplications = async () => {
        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, value]) => value)
            );
            const response = await fetch(`http://localhost:4000/api/leave-applications?${queryParams}`);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            setApplications(data.data);
        } catch (error) {
            toast.error(error.message || 'Error fetching applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/api/leave-applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    admin_remarks: adminRemarks.trim() || undefined
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            toast.success(`Application ${newStatus} successfully`);
            setSelectedApplication(null);
            setAdminRemarks('');
            fetchApplications();
        } catch (error) {
            toast.error(error.message || `Error updating application status`);
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
            case 'pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Leave Applications Management</h1>
                
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg pl-10"
                                    placeholder="Search name, email..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Leave Period
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Parent Details
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
                                        <td colSpan="5" className="px-6 py-4 text-center">
                                            Loading applications...
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">
                                            No applications found
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((application) => (
                                        <tr key={application._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {application.student_information.student_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {application.student_information.student_email}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Roll: {application.student_information.roll_no}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <Calendar className="inline-block w-4 h-4 mr-1" />
                                                    {new Date(application.leave_details.leave_start_date).toLocaleDateString()}
                                                    {' - '}
                                                    {new Date(application.leave_details.leave_end_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Reason: {application.leave_details.reason_for_leave}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {application.parent_information.parent_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {application.parent_information.parent_email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                                {application.admin_remarks && (
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        Remarks: {application.admin_remarks}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {application.status === 'pending' && (
                                                    <button
                                                        onClick={() => setSelectedApplication(application)}
                                                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-200"
                                                    >
                                                        Review
                                                    </button>
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
                {selectedApplication && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-lg w-full p-6">
                            <h3 className="text-lg font-bold mb-4">Review Leave Application</h3>
                            
                            <div className="mb-4">
                                <p className="font-medium">Application Details:</p>
                                <p>Student: {selectedApplication.student_information.student_name}</p>
                                <p>Roll No: {selectedApplication.student_information.roll_no}</p>
                                <p>Leave Period: {new Date(selectedApplication.leave_details.leave_start_date).toLocaleDateString()} - {new Date(selectedApplication.leave_details.leave_end_date).toLocaleDateString()}</p>
                                <p>Reason: {selectedApplication.leave_details.reason_for_leave}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Remarks (optional)
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-lg"
                                    rows="3"
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    placeholder="Add remarks for the student..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedApplication._id, 'rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedApplication._id, 'approved')}
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

export default AdminLeaveDashboard;