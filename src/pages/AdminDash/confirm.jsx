import React from "react";
import { useContext } from "react";
import { LoginContext } from "../../context/Login/Login";
import axios from "axios";

function Confirm({ setShowC, delet, setRefresh, refresh }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { token } = useContext(LoginContext);

  const handleDeletUsr = async () => {
    console.log(refresh);

    try {
      const response = await axios.delete(
        `${backendUrl}user/deleteUser/${delet}`,
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );

      console.log("User deleted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }
    if (refresh) {
      setRefresh(!refresh);
    }
    setShowC(false);
  };

  return (
    <div className="absolute bg-[rgba(0,0,0,0.41)] w-full h-full flex items-center">
      <div className="bg-white w-[50%] h-[50%] ml-[15%] flex flex-col gap-[25%] p-12 items-center">
        <h3>DO YOU REALLY WANT TO DELET THIS USER</h3>
        <div className=" flex gap-[10%]">
          <button className="btn btn-primary" onClick={handleDeletUsr}>
            yes
          </button>
          <button
            className="btn btn-primary "
            onClick={() => setShowC(false)}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
