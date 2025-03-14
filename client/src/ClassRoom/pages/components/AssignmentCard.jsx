import React from 'react';
import { FileText, Download, ChevronDown, CheckCircle, Info, AlertCircle, Loader2 } from 'lucide-react';

const AssignmentCard = ({ submission, expandedSubmission, toggleSubmissionDetails, formatDate, getStatusBadge }) => {
  return (
    <div className="bg-white p-5 shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{submission.assignment.title}</h3>
          <p className="text-gray-600 text-sm">{submission.assignment.subject}</p>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(submission.status)}
          <button 
            onClick={() => toggleSubmissionDetails(submission._id)}
            className="text-gray-400 hover:text-gray-600"
            aria-label={expandedSubmission === submission._id ? "Hide details" : "Show details"}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${expandedSubmission === submission._id ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Submitted:</p>
          <p className="font-medium">{formatDate(submission.submissionDate)}</p>
        </div>
        <div>
          <p className="text-gray-500">Due date:</p>
          <p className="font-medium">{formatDate(submission.assignment.dueDate)}</p>
        </div>
      </div>

      {expandedSubmission === submission._id && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {submission.file && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2 text-sm">Your submission:</p>
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-500 mr-2" />
                <a
                  href={submission.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate flex-1"
                >
                  {submission.file.filename}
                </a>
                <a
                  href={submission.file.url}
                  download
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {submission.status === 'graded' ? (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="font-medium text-green-800">Grade: {submission.grade}</p>
              </div>
              {submission.feedback && (
                <div>
                  <p className="font-medium text-green-800 mb-1">Instructor feedback:</p>
                  <p className="text-green-700 text-sm bg-white p-3 rounded border border-green-100">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-600">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              <p className="text-sm">
                Your submission is being reviewed. Check back later for your grade and feedback.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;