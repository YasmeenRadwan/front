import React from "react";

function TablePagination({ totalPages, currentPage, handlePageChange }) {
  return (
    <div className="flex justify-between items-center mt-[20px]">
      <button
        className={`px-3 py-1 bg-gray-300 rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1
                ? "bg-darkorange text-white"
                : "bg-gray-300"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        className={`px-3 py-1 bg-gray-300 rounded ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default TablePagination;
