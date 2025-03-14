import React from 'react';
import { FileText, Download, UploadCloud } from 'lucide-react';

const AvailableAssignmentCard = ({ assignment, setSelectedAssignment, setActiveTab, getTimeRemaining, formatDate }) => {
  return (
    <div className="bg-white p-5 shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          <p className="text-gray-600 text-sm">{assignment.subject}</p>
        </div>
        <div>{getTimeRemaining(assignment.dueDate)}</div>
      </div>

      <div className="mt-4">
        <div className="mb-3 text-sm">
          <p className="text-gray-500">Due date:</p>
          <p className="font-medium">{formatDate(assignment.dueDate)}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2 text-sm">Description:</h4>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{assignment.description}</p>
        </div>

        {assignment.files && assignment.files.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2 text-sm text-blue-800">Files provided by instructor:</p>
            {assignment.files.map((file, index) => (
              <div key={index} className="flex items-center mt-1">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate flex-1 text-sm"
                >
                  {file.filename}
                </a>
                <a
                  href={file.url}
                  download
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setSelectedAssignment(assignment._id);
            setActiveTab('uploadForm');
          }}
          className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Submit Your Work
        </button>
      </div>
    </div>
  );
};

export default AvailableAssignmentCard;