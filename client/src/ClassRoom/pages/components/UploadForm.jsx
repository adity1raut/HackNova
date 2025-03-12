import React from 'react';
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';

const UploadForm = ({
  selectedAssignment,
  setActiveTab,
  handleSubmit,
  handleFileChange,
  handleFeedbackChange,
  file,
  feedback,
  loading,
  message
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('submitNew')}
          className="text-blue-500 flex items-center text-sm font-medium hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to available assignments
        </button>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Submit Assignment</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('Error') || message.includes('Please select') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload your file
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-blue-500">Click to upload</span>
              <span className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, TXT, ZIP (Max 10MB)
              </span>
            </label>
            {file && (
              <div className="mt-3 text-sm text-gray-800 py-1 px-3 bg-gray-100 rounded-md inline-block">
                {file.name}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional comments or questions (optional)
          </label>
          <textarea
            rows="3"
            value={feedback}
            onChange={handleFeedbackChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any notes for your instructor..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setActiveTab('submitNew')}
            className="mr-3 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !file}
            className={`px-4 py-2 text-sm rounded-md text-white flex items-center ${
              !file || loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Submit Assignment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;