import { useState } from "react";
import TableRow from "./TableRow";
import { LoginContext } from "../context/Login/Login";
import { useContext } from "react";
import TablePagination from "./TablePagination";
const PaginatedTable = ({ data, rowsPerPage }) => {
  const { setUserCart } = useContext(LoginContext);
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / rowsPerPage);
  // Get current data slice for the current page
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Update cart function
  const updateCart = (itemId, newQuantity) => {
    let updatedCart = [...data]; // Copy of the current cart

    // Find the item in the cart
    const itemIndex = updatedCart.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // Update the quantity
      updatedCart[itemIndex].quantity = newQuantity;

      // Remove item if the quantity is 0
      if (newQuantity === 0) {
        updatedCart.splice(itemIndex, 1);
      }
    }
    // Save to localStorage
    localStorage.setItem("userCart", JSON.stringify(updatedCart));
    // Update state to re-render the table
    setUserCart(updatedCart);
  };
  return (
    <div className="">
      <table className="w-full table-auto overflow-x-auto border-collapse border border-gray-200 text-[14px] md:text-[16px] text-center">
        <thead>
          <tr className="bg-gray-100">
            {/* <th className="border border-gray-300 py-2 px-1">id</th> */}
            <th className="border border-gray-300 py-2 px-1">Meal</th>

            {/* <th className="border border-gray-300 py-2 px-1">Image</th> */}
            {/* <th className="border border-gray-300 py-2 px-1">Order Date</th> */}

            <th className="border border-gray-300 py-2 px-1">Quantity</th>
            <th className="border border-gray-300 py-2 px-1">Price</th>
            <th className="border border-gray-300 py-2 px-1">Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item._id} className="bg-white border-b">
              <TableRow
                mealData={item.menuItem}
                quantity={item.quantity}
                totalPrice={item.totalPrice}
                updateCart={updateCart}
              />
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <TablePagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginatedTable;
