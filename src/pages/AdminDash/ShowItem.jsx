import React, { useEffect } from "react";

const ShowItem = ({ category, setShowCay, setCatchng }) => {
  function jandle() {
    setShowCay(false);

    setCatchng(category);
  }
  return (
    <div className="max-w-xs w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center text-center p-4">
    <div className="w-full h-48 mb-4">
      <img
        src={category.image.secure_url}
        alt={category.name}
        className="w-full h-full object-cover rounded-t-md"
      />
    </div>

    <h2 className="text-lg font-semibold mb-2">{category.name}</h2>

        <button
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md shadow-md transition-all duration-300 mt-auto"
          onClick={jandle}
        >
          Show
        </button>
      
    </div>
  );
};

export default ShowItem;
