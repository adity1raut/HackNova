import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function FacultyBook() {
    const [availabilities, setAvailabilities] = useState([]);
    const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10; // You can adjust this value

    useEffect(() => {
        fetchAvailabilities();
    }, [page]);

    const fetchAvailabilities = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/faculty-availability`);

            if (response.status === 200) {
                setAvailabilities(response.data); // Set all availabilities
                filterLast24HoursData(response.data); // Filter data for the last 24 hours
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error('Failed to fetch availabilities. Check console for more details.');
        } finally {
            setLoading(false);
        }
    };

    // Function to filter data for the last 24 hours
    const filterLast24HoursData = (data) => {
        const now = new Date(); // Current date and time
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

        const filteredData = data.filter((availability) => {
            const availabilityDate = new Date(availability.createdAt); // Assuming `createdAt` is the timestamp field
            return availabilityDate >= twentyFourHoursAgo && availabilityDate <= now;
        });

        setFilteredAvailabilities(filteredData);
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage)); // Update total pages based on filtered data
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className='flex pt-20 items-center justify-center'>
            <div className="bg-white/90 backdrop-blur-sm flex-col items-center justify-center shadow-xl w-10/12 rounded-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b w-11/12  border-gray-200">Faculty Availabilities (Last 24 Hours)</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slots</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAvailabilities.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((availability, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>{availability.name}</div>
                                        <div className="text-xs text-gray-500">{availability.designation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{availability.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{availability.dayOfWeek}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {availability.availableTimeSlots.map((slot, slotIndex) => (
                                            <div key={slotIndex}>{slot.start} - {slot.end}</div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                    >
                        Previous
                    </button>

                    <div className="text-gray-600">
                        Page {page} of {totalPages}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FacultyBook;