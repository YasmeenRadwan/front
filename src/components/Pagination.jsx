import { FcNext, FcPrevious } from "react-icons/fc";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="pagination flex justify-center items-center pt-4 pb-8">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-primary-hover text-white mx-1"
      >
        <FcPrevious />
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => paginate(index + 1)}
          className={`px-3 py-1 rounded-full bg-primary-hover text-white mx-1 ${currentPage === index + 1 ? "bg-orange-700" : ""}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-primary-hover text-white mx-1"
      >
        <FcNext className="" />
      </button>
    </div>
  );
};

export default Pagination;
