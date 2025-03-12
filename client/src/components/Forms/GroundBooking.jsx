import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, MessageSquare, Phone, Mail, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroundComponents from "../Other/GroundCopoants";

const VENUES = ["Auditorium", "Classrooms", "Ground"];

const GroundBooking = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        venue: "",
        date: "",
        lastdate: "",
        time: "",
        message: "",
        status: "pending"
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem('email');
            if (!email) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/user/${email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(data);
                setFormData(prev => ({
                    ...prev,
                    name: data.name || '',
                    email: data.email || ''
                }));
            } catch (error) {
                toast.error("Failed to load user data");
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const startDate = new Date(formData.date);
        const endDate = new Date(formData.lastdate);

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2 || formData.name.length > 100) {
            newErrors.name = "Name must be between 2 and 100 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        const phoneRegex = /^[\d-+() ]{10,15}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.date) {
            newErrors.date = "Start date is required";
        } else if (startDate < today.setHours(0, 0, 0, 0)) {
            newErrors.date = "Start date cannot be in the past";
        }

        if (formData.lastdate && endDate < startDate) {
            newErrors.lastdate = "End date must be after start date";
        }

        if (!formData.time) {
            newErrors.time = "Time is required";
        }

        if (!formData.venue) {
            newErrors.venue = "Please select a venue";
        } else if (!VENUES.includes(formData.venue)) {
            newErrors.venue = "Please select a valid venue";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 10 || formData.message.length > 500) {
            newErrors.message = "Message must be between 10 and 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please correct the errors in the form", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:4000/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    toast.error("This venue is already booked for the selected date and time range", {
                        position: "top-right",
                        autoClose: 5000
                    });
                } else if (data.errors) {
                    const serverErrors = {};
                    data.errors.forEach(error => {
                        serverErrors[error.param] = error.msg;
                    });
                    setErrors(serverErrors);
                    toast.error("Please correct the errors in the form", {
                        position: "top-right",
                        autoClose: 3000
                    });
                } else {
                    throw new Error(data.message || 'Error creating booking');
                }
                return;
            }

            toast.success(
                <div>
                    <h4 className="font-bold">Booking Successful! 🎉</h4>
                    <p>Venue: {formData.venue}</p>
                    <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
                    <p>Time: {formData.time}</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );

            setFormData({
                name: "", 
                email: "", 
                phone: "", 
                venue: "",
                date: "", 
                lastdate: "", 
                time: "", 
                message: "", 
                status: "pending"
            });
        } catch (error) {
            toast.error("Error creating booking. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            console.error("Booking error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName = (fieldName) => `
        w-full p-3 border ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} 
        rounded-lg focus:outline-none focus:ring-2 
        ${errors[fieldName] ? 'focus:ring-red-500' : 'focus:ring-green-500'} 
        focus:border-transparent transition-all duration-200 bg-white/90
    `;
    
    const labelClassName = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2";
    const errorClassName = "text-red-500 text-sm mt-1";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="max-w-6xl mx-auto p-4 pt-24">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Available Venues
                </h1>
                <GroundComponents />
                <div className="my-16 max-w-4xl mx-auto border-t border-green-200" />

                <div className="flex justify-center pb-16">
                    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            Book Your Venue
                        </h2>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className={labelClassName}>
                                        <User size={16} /> Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={inputClassName('name')}
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                    />
                                    {errors.name && <p className={errorClassName}>{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClassName}>
                                        <Mail size={16} /> Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={inputClassName('email')}
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                    />
                                    {errors.email && <p className={errorClassName}>{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className={labelClassName}>
                                        <Phone size={16} /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className={inputClassName('phone')}
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.phone && <p className={errorClassName}>{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="venue" className={labelClassName}>
                                        <MapPin size={16} /> Venue
                                    </label>
                                    <select
                                        id="venue"
                                        className={inputClassName('venue')}
                                        value={formData.venue}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a venue</option>
                                        {VENUES.map(venue => (
                                            <option key={venue} value={venue}>{venue}</option>
                                        ))}
                                    </select>
                                    {errors.venue && <p className={errorClassName}>{errors.venue}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="date" className={labelClassName}>
                                        <Calendar size={16} /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        className={inputClassName('date')}
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.date && <p className={errorClassName}>{errors.date}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lastdate" className={labelClassName}>
                                        <Calendar size={16} /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="lastdate"
                                        className={inputClassName('lastdate')}
                                        value={formData.lastdate}
                                        onChange={handleChange}
                                    />
                                    {errors.lastdate && <p className={errorClassName}>{errors.lastdate}</p>}
                                </div>

                                <div>
                                    <label htmlFor="time" className={labelClassName}>
                                        <Clock size={16} /> Time
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        className={inputClassName('time')}
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.time && <p className={errorClassName}>{errors.time}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className={labelClassName}>
                                    <MessageSquare size={16} /> Message
                                </label>
                                <textarea
                                    id="message"
                                    className={`${inputClassName('message')} resize-none`}
                                    placeholder="Additional details or special requests..."
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                {errors.message && <p className={errorClassName}>{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 text-base font-semibold shadow-md hover:shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Clock className="animate-spin" size={18} />
                                        Processing...
                                    </div>
                                ) : (
                                    'Book Now'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default GroundBooking;