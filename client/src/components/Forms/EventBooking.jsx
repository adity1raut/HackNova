import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Clock, UserCircle, Users, FileText, MapPin } from 'lucide-react';
import EventTable from '../Tables/EventTable'; // Import the EventTable component

const FacultyEventForm = () => {
  const [formData, setFormData] = useState({
    faculty_information: {
      organizingFaculty: '',
      facultyDepartment: '',
      facultyEmail: '',
      facultyPhone: ''
    },
    event_information: {
      eventName: '',
      eventDescription: '',
      eventLocation: ''
    },
    event_schedule: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      expectedAttendees: ''
    },
    additional_information: {
      websiteDisplay: '',
      additionalRequirements: ''
    }
  });

  const [activeSection, setActiveSection] = useState('faculty_information');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
    // Clear validation errors when the user starts typing
    if (validationErrors[section]?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: ''
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    console.log(formData);
    try {
      // Use the correct endpoint for faculty events
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          // Handle validation errors
          const errors = data.errors.reduce((acc, error) => {
            const [section, field] = error.path.split('.');
            if (!acc[section]) acc[section] = {};
            acc[section][field] = error.msg;
            return acc;
          }, {});
          setValidationErrors(errors);
          toast.error('Please fix the errors in the form.');
        } else {
          throw new Error(data.message || 'Failed to submit event request');
        }
        return;
      }

      toast.success('Event request submitted successfully!');
      setFormData({
        faculty_information: {
          organizingFaculty: '',
          facultyDepartment: '',
          facultyEmail: '',
          facultyPhone: ''
        },
        event_information: {
          eventName: '',
          eventDescription: '',
          eventLocation: ''
        },
        event_schedule: {
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          expectedAttendees: ''
        },
        additional_information: {
          websiteDisplay: '',
          additionalRequirements: ''
        }
      });
      setActiveSection('faculty_information');
      setValidationErrors({});
    } catch (error) {
      toast.error(error.message || 'Error submitting event request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 hover:bg-white";
  const labelClassName = "block text-sm font-medium text-gray-600 mb-1";

  const renderInput = (section, name, label, type = "text") => (
    <div>
      <label className={labelClassName}>
        {label}<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={formData[section][name]}
        onChange={(e) => handleChange(e, section)}
        className={`${inputClassName} ${validationErrors[section]?.[name] ? 'border-red-500' : ''}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {validationErrors[section]?.[name] && (
        <p className="text-red-500 text-sm mt-1">{validationErrors[section][name]}</p>
      )}
    </div>
  );

  const renderSelect = (section, name, label, options) => (
    <div>
      <label className={labelClassName}>
        {label}<span className="text-red-500 ml-1">*</span>
      </label>
      <select
        name={name}
        value={formData[section][name]}
        onChange={(e) => handleChange(e, section)}
        className={`${inputClassName} ${validationErrors[section]?.[name] ? 'border-red-500' : ''}`}
      >
        <option value="" disabled>Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {validationErrors[section]?.[name] && (
        <p className="text-red-500 text-sm mt-1">{validationErrors[section][name]}</p>
      )}
    </div>
  );

  const renderTextarea = (section, name, label, required = true) => (
    <div>
      <label className={labelClassName}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={formData[section][name]}
        onChange={(e) => handleChange(e, section)}
        rows={name === "eventDescription" ? "4" : "3"}
        className={`${inputClassName} resize-none ${validationErrors[section]?.[name] ? 'border-red-500' : ''}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {validationErrors[section]?.[name] && (
        <p className="text-red-500 text-sm mt-1">{validationErrors[section][name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
          Faculty Event Request Form
        </h1>

        <div className="flex flex-col items-center gap-8 justify-center">
          <div className="lg:w-[600px]">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 sticky top-8 border border-gray-100">
              {/* Progress Indicator */}
              <div className="flex justify-between mb-8">
                {['faculty_information', 'event_information', 'event_schedule'].map((section, index) => (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setActiveSection(section)}
                    className={`flex flex-col items-center group ${index !== 2 ? 'flex-1' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      activeSection === section 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-500 group-hover:bg-purple-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="h-1 flex-1 bg-gray-200 group-hover:bg-purple-200"/>
                  </button>
                ))}
              </div>

              {/* Faculty Information Section */}
              <div className={`transition-all duration-300 ${activeSection === 'faculty_information' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <UserCircle className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Faculty Information</h3>
                </div>
                <div className="space-y-4">
                  {renderInput('faculty_information', 'organizingFaculty', 'Organizing Faculty')}
                  {renderInput('faculty_information', 'facultyDepartment', 'Department')}
                  {renderInput('faculty_information', 'facultyEmail', 'Email Address', 'email')}
                  {renderInput('faculty_information', 'facultyPhone', 'Phone Number', 'tel')}
                </div>
              </div>

              {/* Event Information Section */}
              <div className={`mt-8 transition-all duration-300 ${activeSection === 'event_information' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Event Information</h3>
                </div>
                <div className="space-y-4">
                  {renderInput('event_information', 'eventName', 'Event Name')}
                  {renderTextarea('event_information', 'eventDescription', 'Event Description')}
                  {renderSelect('event_information', 'eventLocation', 'Event Location', [
                    { value: 'Ground', label: 'Ground' },
                    { value: 'Audi', label: 'Auditorium' },
                    { value: 'Conf Hall', label: 'Conference Hall' },
                    { value: 'Cult Hall', label: 'Cultural Hall' },
                    { value: 'Tech Hall', label: 'Technical Hall' }
                  ])}
                </div>
              </div>

              {/* Event Schedule Section */}
              <div className={`mt-8 transition-all duration-300 ${activeSection === 'event_schedule' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Event Schedule</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {renderInput('event_schedule', 'startDate', 'Start Date', 'date')}
                    {renderInput('event_schedule', 'endDate', 'End Date', 'date')}
                  </div>
                  <div className="flex gap-4">
                    {renderInput('event_schedule', 'startTime', 'Start Time', 'time')}
                    {renderInput('event_schedule', 'endTime', 'End Time', 'time')}
                  </div>
                  {renderInput('event_schedule', 'expectedAttendees', 'Expected Attendees', 'number')}
                  
                  <div>
                    <label className={labelClassName}>
                      Website Display Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="websiteDisplay"
                      value={formData.additional_information.websiteDisplay}
                      onChange={(e) => handleChange(e, 'additional_information')}
                      className={`${inputClassName} ${validationErrors.additional_information?.websiteDisplay ? 'border-red-500' : ''}`}
                      placeholder="Enter name for website display"
                    />
                    {validationErrors.additional_information?.websiteDisplay && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.additional_information.websiteDisplay}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className={labelClassName}>
                      Additional Requirements
                    </label>
                    <textarea
                      name="additionalRequirements"
                      value={formData.additional_information.additionalRequirements}
                      onChange={(e) => handleChange(e, 'additional_information')}
                      rows="3"
                      className={`${inputClassName} resize-none`}
                      placeholder="Any additional requirements (optional)"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-102 mt-8 text-lg uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Clock className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting...
                  </div>
                ) : (
                  'Submit Event Request'
                )}
              </button>
            </form>
          </div>

          <div className="flex w-full justify-center py-10">
            <div className="w-full lg:w-[1000px]">
              {/* Replace the placeholder with the EventTable component */}
              <EventTable />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// Example function to create a new event
async function createEvent(eventData) {
    try {
        const response = await fetch('http://localhost:4000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('Error creating event:', result.message);
            return;
        }

        console.log('Event created successfully:', result.data);
    } catch (error) {
        console.error('Error creating event:', error);
    }
}

// Example usage
const eventData = {
    event_name: 'Sample Event',
    event_description: 'This is a sample event.',
    event_date: '2025-03-15T10:00:00Z',
    event_location: 'Sample Location',
    organizer_email: 'organizer@example.com'
};

createEvent(eventData);

export default FacultyEventForm;