import React, { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

const NoticeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    details: '',
    image: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState('');

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.subject.trim()) return 'Subject is required';
    if (!formData.date) return 'Date is required';
    if (!formData.details.trim()) return 'Details are required';
    if (formData.image && formData.image.size > 5 * 1024 * 1024) return 'Image size must be less than 5MB';
    return null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch('http://localhost:4000/api/notice', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create notice');
      }

      toast.success('Notice created successfully!');
      setFormData({
        title: '',
        subject: '',
        date: '',
        details: '',
        image: null
      });
      setPreview('');
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-20 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Notice</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image (optional, max 5MB)
          </label>
          {!preview ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpeg, image/gif"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2 inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs rounded-md"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            'Submit Notice'
          )}
        </button>
      </form>
    </div>
  );
};

export default NoticeForm;