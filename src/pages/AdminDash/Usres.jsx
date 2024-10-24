import React, { useState, useEffect, useContext } from "react";
import UserCard from "./UserCard";
import Confirm from "./confirm";
import axios from "axios";
import { LoginContext } from "../../context/Login/Login";
import Spinner from "../../components/Spinner";
import UsersTable from "./UsersTable";
import TablePagination from "../../components/TablePagination";
function Users() {
  
  const [showc, setShowC] = useState(false);
  const [users, setUsers] = useState([]);
  const { token } = useContext(LoginContext);
  const [delet, setDelet] = useState("");
  const [refresh, setRefresh] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const allU = async () => {
    try {
      const response = await axios.get(`${backendUrl}user/allUsers/`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    allU().then((data) => {
      if (data && Array.isArray(data.usersData)) {
        setUsers(data.usersData);
      } else {
      }
    });
  }, [refresh]);

  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total number of pages
  const rowsPerPage = 5;
  const totalPages = Math.ceil(users.length / rowsPerPage);
  // Get current data slice for the current page
  const currentData = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div
      className="overflow-y-scroll scrollbar-hidden h-[90vh]"
      style={{ scrollbarWidth: "none" }}
    >
      {showc && (
        <Confirm
          setShowC={setShowC}
          delet={delet}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {users.length > 0 ? (
        <div className=" px-[10px] md:px-[40px] py-[40px] w-[95%] mx-auto min-h-[70vh] flex flex-col justify-between">
          {" "}
          <div >
            Users List
            <UsersTable
              className=""
              users={currentData}
              setDelet={setDelet}
              setShowC={setShowC}
            />
          </div>
          <TablePagination
          
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default Users;
