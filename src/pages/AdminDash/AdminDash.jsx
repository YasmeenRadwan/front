import { Link, Outlet, useLocation } from "react-router-dom";
import { LoginContext } from "../../context/Login/Login";
import { useContext } from "react";

function AdminDash() {
  const { admin } = useContext(LoginContext);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
   <>
    {
      admin && 
      (
        <div className="lg:flex lg: relative ">

          <div className="w-full lg:w-1/4 lg:h-[90vh] bg- p-4 border-r-2 border-gray-300 lg:border-none lg:bg-transparent lg:flex lg:flex-col">

            <ul className="flex lg:flex-col justify-between lg:justify-start items-center lg:items-start w-full lg:gap-[20px] gap-0 sm:w-[] flex-wrap">

              <li className="flex items-center lg:flex-row flex-row">
                <i className="fa-solid fa-user lg:mr-3 mr-2"></i>
                <Link
                  to="/dash"
                  className={isActive("/dash") ? "text-primary-hover" : ""}
                >
                  Users
                </Link>
              </li>

              <li className="flex items-center lg:flex-row flex-row">
                <i className="fa-solid fa-list lg:mr-3 mr-2"></i>
                <Link
                  to="catogory"
                  className={isActive("/dash/catogory") ? "text-primary-hover" : ""}
                >
                  Category
                </Link>
              </li>

              <li className="flex items-center lg:flex-row flex-row">
                <i className="fa-solid fa-utensils lg:mr-3 mr-2"></i>
                <Link
                  to="Manue"
                  className={isActive("/dash/Manue") ? "text-primary-hover" : ""}
                >
                  Menu
                </Link>
              </li>

              <li className="flex items-center lg:flex-row flex-row">
                <i className="fa-regular fa-folder lg:mr-3 mr-2"></i>
                <Link
                  to="orders"
                  className={isActive("/dash/orders") ? "text-primary-hover" : ""}
                >
                  Orders
                </Link>
              </li>

            </ul>
          </div>

          <div className="lg:w-3/4 w-full lg:mt-0 mt-6">
            <Outlet />
          </div>
        </div>
      )
    }
   </>
  );
}

export default AdminDash;
