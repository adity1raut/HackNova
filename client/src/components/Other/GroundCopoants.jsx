import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';

function GroundComponents() {
    const navigate = useNavigate();
    const venues = [
        {
            venue: "Auditorium",
            name: "Auditorium",
            capacity: "400 Seats",
            location: "Admin Building",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874682/your-cloudinary-folder-name/yeq93de3i3jk5yniybz8.jpg",
            prize: "20,000"
        },
        {
            venue: "Classrooms",
            name: "Classrooms",
            capacity: "100 Seats",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874684/your-cloudinary-folder-name/o6l8nuliwj7w13xtphiz.jpg",
            location: "Near ExTc Department",
            prize: "5,000"
        },
        {
            venue: "Ground",
            name: "Ground",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874685/your-cloudinary-folder-name/giq98eafvxn4pz6j5acc.webp",
            capacity: "Varies depending on the events.",
            location: "Near Sahyadri Hostel",
            prize: "10,000"
        }
    ];

    const handleViewDetails = (venueName) => {
        navigate(`/bookings/details/${venueName}`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {venues.map((venue, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="relative">
                            <img src={venue.image} className="w-full h-48 object-cover" alt={venue.name} />
                            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full shadow-md">
                                <span className="text-sm font-medium text-gray-700">₹{venue.prize}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h5 className="text-xl font-bold text-gray-800 mb-4">{venue.name}</h5>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPin size={16} />
                                    <span>{venue.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Users size={16} />
                                    <span>{venue.capacity}</span>
                                </div>
                            </div>
                            <button onClick={() => handleViewDetails(venue.name)} className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium flex items-center justify-center gap-2">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroundComponents;
