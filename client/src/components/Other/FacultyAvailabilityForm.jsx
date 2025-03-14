import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacultyTable from '../Tables/FacultyTable';

const FacultyAvailabilityForm = ({ initialAvailability }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        dayOfWeek: '',
        availableTimeSlots: [{ start: '09:00 AM', end: '10:00 AM' }]
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availabilities, setAvailabilities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);


    const departments = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical'
    ];

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer'
    ];

    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    // Time options from 8 AM to 8 PM
    const timeOptions = Array.from({ length: 25 }, (_, i) => {
        const hour = Math.floor(i / 2) + 8;
        const minute = i % 2 === 0 ? '00' : '30';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        return `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`;
    });

    const validateForm = () => {
        const errors = {};

        if (formData.name.length < 2 || formData.name.length > 50) {
            errors.name = 'Name must be between 2 and 50 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Valid email is required';
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Valid phone number is required';
        }

        if (formData.department.length < 2 || formData.department.length > 50) {
            errors.department = 'Department must be between 2 and 50 characters';
        }

        if (formData.designation.length < 2 || formData.designation.length > 50) {
            errors.designation = 'Designation must be between 2 and 50 characters';
        }

        if (!formData.dayOfWeek) {
            errors.dayOfWeek = 'Day of week is required';
        }

        if (!formData.availableTimeSlots.every(slot => slot.start && slot.end)) {
            errors.timeSlots = 'All time slots must be filled';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is modified
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleTimeSlotChange = (index, field, value) => {
        const newTimeSlots = [...formData.availableTimeSlots];
        newTimeSlots[index] = {
            ...newTimeSlots[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            availableTimeSlots: newTimeSlots
        }));
        if (formErrors.timeSlots) {
            setFormErrors(prev => ({ ...prev, timeSlots: undefined }));
        }
    };

    const addTimeSlot = () => {
        setFormData(prev => ({
            ...prev,
            availableTimeSlots: [...prev.availableTimeSlots, { start: '09:00 AM', end: '10:00 AM' }]
        }));
    };

    const removeTimeSlot = (index) => {
        if (formData.availableTimeSlots.length > 1) {
            setFormData(prev => ({
                ...prev,
                availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index)
            }));
        }
    };

    const fetchAvailabilities = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/faculty-availability');
            setAvailabilities(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch availabilities.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting.');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting availability...');

        try {
            let response;
            if (isEditing && initialAvailability) {
                // Assuming your API endpoint for updates includes the ID
                response = await axios.put(`http://localhost:4000/api/faculty-availability/${initialAvailability._id}`, formData);
            } else {
                response = await axios.post('http://localhost:4000/api/faculty-availability', formData);
            }

            toast.update(loadingToast, {
                render: response.data.message,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                department: '',
                designation: '',
                dayOfWeek: '',
                availableTimeSlots: [{ start: '09:00 AM', end: '10:00 AM' }]
            });

            fetchAvailabilities();
            setIsEditing(false); // Reset editing state after successful submission
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Failed to submit availability";

            toast.update(loadingToast, {
                render: errorMessage,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });

            // Handle validation errors from server
            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setFormErrors(serverErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchAvailabilities();
    }, []);

    // Load initial availability data when the component mounts in edit mode
    useEffect(() => {
        if (initialAvailability) {
            setIsEditing(true);
            setFormData(initialAvailability);
        }
    }, [initialAvailability]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
                    Faculty Availability Management
                </h1>

                <div className="flex flex-col items-center gap-8">
                    {/* Form Section */}
                    <div className="lg:w-6/12">
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 sticky top-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                {isEditing ? 'Update Availability' : 'Add Availability'}
                            </h2>

                            <div className="space-y-6">
                                {/* Form fields remain the same, just add error display */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Faculty name"
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Faculty Email"
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Faculty Phone"
                                    />
                                    {formErrors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.department ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {formErrors.department && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.department}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Designation<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.designation ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <option value="">Select Designation</option>
                                        {designations.map(designation => (
                                            <option key={designation} value={designation}>{designation}</option>
                                        ))}
                                    </select>
                                    {formErrors.designation && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.designation}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Day of Week<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="dayOfWeek"
                                        value={formData.dayOfWeek}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white ${formErrors.dayOfWeek ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <option value="">Select Day of Week</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    {formErrors.dayOfWeek && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.dayOfWeek}</p>
                                    )}
                                </div>
                                {/* Repeat similar structure for other fields */}
                                {/* Time slots section with dropdown instead of time input */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Time Slots<span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addTimeSlot}
                                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            + Add Time Slot
                                        </button>
                                    </div>

                                    {formData.availableTimeSlots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <select
                                                    value={slot.start}
                                                    onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                                >
                                                    {timeOptions.map(time => (
                                                        <option key={`start-${time}`} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <select
                                                    value={slot.end}
                                                    onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                                >
                                                    {timeOptions.map(time => (
                                                        <option key={`end-${time}`} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {formErrors.timeSlots && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.timeSlots}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-8 text-lg uppercase tracking-wide ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : isEditing ? 'Update Availability' : 'Submit Availability'}
                            </button>
                        </form>
                    </div>

                    {/* Availabilities List */}
                    <div className="lg:w-2/3">
                        <FacultyTable availabilities={availabilities} />
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default FacultyAvailabilityForm;
