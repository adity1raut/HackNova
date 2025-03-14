import React, { useEffect, useState } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  IndianRupee,
  Info,
  Briefcase,
  Calendar,
  ChevronLeft
} from 'lucide-react';

const VenueDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [venueData, setVenueData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const response = await fetch('/venues.json');
        if (!response.ok) {

          throw new Error('Failed to fetch venue data');
        }
        const data = await response.json();
        console.log(data)
        const venue = data.find(v => v.basicInfo.name === name);

        if (!venue) {
          setError('Venue not found');
          return;
        }

        setVenueData(venue);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();
  }, [name]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !venueData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Venue not found'}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
        ${activeTab === id
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white/50 hover:bg-white/80'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl pt-20 mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 group"
        >
          <ChevronLeft className="transition-transform group-hover:-translate-x-1" />
          Back to Venues
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-80">
            <img
              src={venueData.basicInfo.image}
              alt={venueData.basicInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{venueData.basicInfo.name}</h1>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {venueData.basicInfo.location}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
              <TabButton id="details" label="Details" icon={Info} />
              <TabButton id="facilities" label="Facilities" icon={Briefcase} />
              <TabButton id="availability" label="Availability" icon={Calendar} />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === 'details' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-semibold text-gray-800">About this Venue</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {venueData.details.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
                      <ul className="space-y-2 text-gray-600">
                        {venueData.details.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For</h3>
                      <ul className="space-y-2 text-gray-600">
                        {venueData.details.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Facilities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venueData.facilities.map((facility) => (
                      <div key={facility.id} className="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
                        <Briefcase className="text-blue-500 mt-1" size={20} />
                        <div>
                          <h4 className="font-medium text-gray-800">{facility.name}</h4>
                          <p className="text-sm text-gray-600">{facility.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Availability</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Opening Hours</h3>
                      <p className="text-gray-600">
                        {venueData.availability.schedule.openingTime} - {venueData.availability.schedule.closingTime}
                      </p>
                      <p className="text-gray-600 mt-2">
                        Open: {venueData.availability.schedule.openDays.join(', ')}
                      </p>
                      <p className="text-gray-600">
                        Closed: {venueData.availability.maintenanceDays.join(', ')}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Restrictions</h3>
                      <ul className="space-y-2 text-gray-600">
                        {venueData.availability.restrictions.map((restriction, index) => (
                          <li key={index}>{restriction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="text-blue-500" />
                  <span>Capacity: {venueData.quickInfo.capacity}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <IndianRupee className="text-blue-500" />
                  <span>Price: {venueData.quickInfo.price.currency}{venueData.quickInfo.price.amount} {venueData.quickInfo.price.unit}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="text-blue-500" />
                  <span>Location: {venueData.quickInfo.location.building}</span>
                </div>
              </div>

              <Link to="/bookings">
                <button className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Book Now
                </button>
              </Link>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
              <div className="space-y-4">
                <p className="text-gray-600">Contact our support team:</p>
                <div className="text-gray-600">
                  <p>Email: {venueData.contact.supportEmail}</p>
                  <p>Phone: {venueData.contact.bookingPhone}</p>
                  <p>Hours: {venueData.contact.helpDeskHours}</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;