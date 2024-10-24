import { Outlet, Navigate } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { LoginContext } from "../context/Login/Login"; 

function AccountView() {
  const { isLoggedIn } = useContext(LoginContext); 

 
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AccountView;
