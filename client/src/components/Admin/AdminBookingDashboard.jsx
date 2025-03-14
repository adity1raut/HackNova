import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Check, X, } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBookingDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        venue: '',
        date: '',
        search: ''
    });
    const [adminMessage, setAdminMessage] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const venues = ["Auditorium", "Classrooms", "Ground"];
    const statuses = ["pending", "approved", "rejected"];

    useEffect(() => {
        fetchBookings();
    }, [filters]);

    const fetchBookings = async () => {
        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, value]) => value)
            );
            const response = await fetch(`http://localhost:4000/api/admin/bookings?${queryParams}`);
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            setBookings(data.bookings);
        } catch (error) {
            toast.error(error.message || 'Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/booking/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    adminMessage: adminMessage.trim() || undefined
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            toast.success(`Booking ${newStatus} successfully`);
            setSelectedBooking(null);
            setAdminMessage('');
            fetchBookings();
        } catch (error) {
            toast.error(error.message || `Error updating booking status`);
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
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Booking Management</h1>
                
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
                                Venue
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.venue}
                                onChange={(e) => handleFilterChange('venue', e.target.value)}
                            >
                                <option value="">All Venues</option>
                                {venues.map(venue => (
                                    <option key={venue} value={venue}>{venue}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={filters.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
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

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Booking Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venue & Time
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
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.email}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {booking.venue}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <Calendar className="inline-block w-4 h-4 mr-1" />
                                                    {new Date(booking.date).toLocaleDateString()}
                                                    {booking.lastdate && ` - ${new Date(booking.lastdate).toLocaleDateString()}`}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <Clock className="inline-block w-4 h-4 mr-1" />
                                                    {booking.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {booking.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-200"
                                                        >
                                                            Review
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.adminMessage && (
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        Note: {booking.adminMessage}
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
                {selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-lg w-full p-6">
                            <h3 className="text-lg font-bold mb-4">Update Booking Status</h3>
                            
                            <div className="mb-4">
                                <p className="font-medium">Booking Details:</p>
                                <p>Name: {selectedBooking.name}</p>
                                <p>Venue: {selectedBooking.venue}</p>
                                <p>Date: {new Date(selectedBooking.date).toLocaleDateString()}</p>
                                <p>Time: {selectedBooking.time}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Message (optional)
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-lg"
                                    rows="3"
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                    placeholder="Add a message for the user..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedBooking._id, 'rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedBooking._id, 'approved')}
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

export default AdminBookingDashboard;