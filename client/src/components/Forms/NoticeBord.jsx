import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, Clock, ChevronRight, User, X } from 'lucide-react';
import { toast } from 'react-toastify';

const NoticeBord = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 10; // Match with backend limit

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const fetchNotices = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/notice?page=${page}&limit=${itemsPerPage}&sort=-date`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }
      
      const data = await response.json();
      setNotices(data.notices);
      setTotalPages(data.totalPages);
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseFullScreen = () => {
    setSelectedImage(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Notices</h2>

      {notices.length === 0 ? (
        <div className="text-center text-gray-500">No notices found</div>
      ) : (
        <>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex"
              >
                {notice.image && (
                  <div className="w-48 h-48 flex-shrink-0">
                    <img
                      src={notice.image}
                      alt={notice.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleViewImage(notice.image)}
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {notice.title}
                      </h3>
                      <span className="flex items-center text-sm text-blue-500">
                        <User className="h-4 w-4 mr-1" />
                        {notice.subject}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {notice.details}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notice.date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(notice.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewImage(notice.image)}
                      className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      View More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;
                // Show first page, last page, current page, and one page before and after current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Full-Screen Image View */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Screen"
              className="max-w-full max-h-screen object-contain"
            />
            <button
              onClick={handleCloseFullScreen}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBord;