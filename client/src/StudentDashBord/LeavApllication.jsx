import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Clock, UserCircle, Users, FileText } from 'lucide-react';
import LeaveTable from '../components/Tables/LeaveTable';

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    student_information: {
      roll_no: '',
      student_name: '',
      student_email: ''
    },
    parent_information: {
      parent_name: '',
      parent_email: ''
    },
    leave_details: {
      reason_for_leave: '',
      leave_start_date: '',
      leave_end_date: ''
    },
    additional_information: {
      comments: ''
    }
  });

  const [activeSection, setActiveSection] = useState('student_information');
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
    try {
      const response = await fetch('http://localhost:4000/api/leave-applications', {
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
          throw new Error(data.message || 'Failed to submit application');
        }
        return;
      }

      toast.success('Leave application submitted successfully!');
      setFormData({
        student_information: { roll_no: '', student_name: '', student_email: '' },
        parent_information: { parent_name: '', parent_email: '' },
        leave_details: { reason_for_leave: '', leave_start_date: '', leave_end_date: '' },
        additional_information: { comments: '' }
      });
      setActiveSection('student_information');
      setValidationErrors({});
    } catch (error) {
      toast.error(error.message || 'Error submitting application');
    } finally {
      setIsSubmitting(false);
    }
  };
  const useremail = localStorage.getItem("email") ;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
          Leave Application Form
        </h1>

        <div className="flex flex-col items-center gap-8 justify-center">
          <div className="lg:w-[600px]">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 sticky top-8 border border-gray-100">
              {/* Progress Indicator */}
              <div className="flex justify-between mb-8">
                {['student_information', 'parent_information', 'leave_details'].map((section, index) => (
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

              {/* Student Information Section */}
              <div className={`transition-all duration-300 ${activeSection === 'student_information' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <UserCircle className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Student Information</h3>
                </div>
                <div className="space-y-4">
                  {renderInput('student_information', 'student_name', 'Full Name')}
                  {renderInput('student_information', 'roll_no', 'Roll Number')}
                  {renderInput('student_information', 'student_email', 'Email Address', useremail)}
                </div>
              </div>

              {/* Parent Information Section */}
              <div className={`mt-8 transition-all duration-300 ${activeSection === 'parent_information' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <Users className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Parent Information</h3>
                </div>
                <div className="space-y-4">
                  {renderInput('parent_information', 'parent_name', "Parent's Name")}
                  {renderInput('parent_information', 'parent_email', "Parent's Email", 'email')}
                </div>
              </div>

              {/* Leave Details Section */}
              <div className={`mt-8 transition-all duration-300 ${activeSection === 'leave_details' ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">Leave Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>
                      Reason for Leave<span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="reason_for_leave"
                      value={formData.leave_details.reason_for_leave}
                      onChange={(e) => handleChange(e, 'leave_details')}
                      rows="4"
                      className={`${inputClassName} resize-none ${validationErrors.leave_details?.reason_for_leave ? 'border-red-500' : ''}`}
                      placeholder="Please provide detailed reason for leave"
                    />
                    {validationErrors.leave_details?.reason_for_leave && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.leave_details.reason_for_leave}</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {renderInput('leave_details', 'leave_start_date', 'Start Date', 'date')}
                    {renderInput('leave_details', 'leave_end_date', 'End Date', 'date')}
                  </div>
                  <div>
                    <label className={labelClassName}>
                      Additional Comments
                    </label>
                    <textarea
                      name="comments"
                      value={formData.additional_information.comments}
                      onChange={(e) => handleChange(e, 'additional_information')}
                      rows="2"
                      className={`${inputClassName} resize-none`}
                      placeholder="Any additional comments (optional)"
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
                  'Submit Application'
                )}
              </button>
            </form>
          </div>

          <div className="flex w-full justify-center py-10">
            <div className="w-full lg:w-[1000px]">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Previous Applications</h2>
                </div>
                <LeaveTable />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveApplicationForm;