import React, { useState } from 'react';
import { 
  Loader2, 
  FileImage, 
  Send, 
  User, 
  Mail, 
  FileText, 
  UserCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CheatingReports = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    email: '',
    reportedBy: '',
    proof: null,
    action: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      e.target.value = '';
      return;
    }
    setFormData(prev => ({ ...prev, proof: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formDataToSend.append(key, value);
      });

      const response = await fetch('http://localhost:4000/api/cheating', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit report');

      setFormData({
        name: '',
        reason: '',
        email: '',
        reportedBy: '',
        proof: null,
        action: '',
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-20 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-500" />
          Submit Cheating Report
        </h2>

        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Report submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name of reported person"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="reason"
              placeholder="Detailed description of the incident"
              value={formData.reason}
              onChange={handleInputChange}
              required
              maxLength={1000}
              className="w-full pl-10 p-2 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Contact email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="reportedBy"
              placeholder="Your name"
              value={formData.reportedBy}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              name="action"
              value={formData.action}
              onChange={handleInputChange}
              required
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an action</option>
              <option value="Exam Performance Cancellation(EPC)">Exam Performance Cancellation (EPC)</option>
              <option value="Subject Performance Cancellation(SPC)">Subject Performance Cancellation (SPC)</option>
              <option value="Whole Performance Cancellation(WPC)">Whole Performance Cancellation (WPC)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <FileImage className="h-5 w-5 text-gray-500" />
            <input
              type="file"
              name="proof"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
              className="w-full cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : ( 
              <>
                <Send className="h-5 w-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheatingReports;
